import {
  DynamoPdfDocumentRepository,
  GeneratePdfDocument,
  GeneratePdfDocumentCommand,
  PgWrapper,
  PostgresReceiptTemplateRepository,
  PuppeteerPdfBuilder,
  S3PdfDocumentArtifactStore,
  TemplateEngineRouter,
  type Credentials,
  type PdfDocumentArtifactStore
} from '../../main'
import { EventBridgeEventPublisher } from '@libs/common-infra'
import { dynamoClient, s3Client, eventBridgeClient } from '@libs/common-infra'
import { LocalPdfDocumentArtifactStore } from '../adapters/local/LocalPdfDocumentArtifactStore'
import { LocalPdfDocumentRepository } from '../adapters/local/LocalPdfDocumentRepository'
import { NullTemplateRepository } from '../adapters/local/NullTemplateRepository'
import { ConsoleEventPublisher } from '../adapters/local/ConsoleEventPublisher'

export type GeneratePdfDocumentControllerResult = {
  id: string
  publicTempUrl: string
}

export class GeneratePdfDocumentController {
  constructor(
    private readonly useCase: GeneratePdfDocument,
    private readonly pdfDocumentArtifactStore: PdfDocumentArtifactStore
  ) {}

  async execute(
    command: GeneratePdfDocumentCommand
  ): Promise<GeneratePdfDocumentControllerResult> {
    const result = await this.useCase.execute(command)

    if (!result.artifact) {
      throw new Error(
        `PDF generation failed: ${result.toPrimitives().failedReason}`
      )
    }

    const publicTempUrl = await this.pdfDocumentArtifactStore.getPublicTempUrl(
      result.artifact,
      60 * 10
    )

    return {
      id: result.id.toString(),
      publicTempUrl
    }
  }
}

export class GeneratePdfDocumentControllerFactory {
  static create(tenantId: string): GeneratePdfDocumentController {
    if (process.env.PDF_GENERATION_MODE === 'local') {
      return this.createLocal(tenantId)
    }

    const pdfDocumentRepository = new DynamoPdfDocumentRepository(
      dynamoClient,
      process.env.DYNAMO_PDF_TABLE_NAME!,
      tenantId
    )

    const templateRepository = new PostgresReceiptTemplateRepository(
      PgWrapper.getInstance(tenantId, this.getPayrollCredentials())
    )

    const pdfBuilder = new PuppeteerPdfBuilder()
    const templateEngine = new TemplateEngineRouter()

    const pdfDocumentArtifactStore = new S3PdfDocumentArtifactStore(
      s3Client,
      process.env.DOCUMENTS_BUCKET_NAME!,
      process.env.BASE_FOLDER_NAME!,
      tenantId
    )

    const eventPublisher = new EventBridgeEventPublisher(
      eventBridgeClient,
      process.env.EVENT_BUS_NAME!,
      process.env.EVENT_SOURCE!,
      tenantId
    )

    const useCase = new GeneratePdfDocument(
      pdfDocumentRepository,
      pdfDocumentArtifactStore,
      templateRepository,
      templateEngine,
      pdfBuilder,
      eventPublisher
    )

    return new GeneratePdfDocumentController(useCase, pdfDocumentArtifactStore)
  }

  private static createLocal(tenantId: string): GeneratePdfDocumentController {
    const outputDir = process.env.LOCAL_OUTPUT_DIR ?? 'local-output'

    const pdfDocumentRepository = new LocalPdfDocumentRepository(
      outputDir,
      tenantId
    )

    const templateRepository = new NullTemplateRepository()
    const pdfBuilder = new PuppeteerPdfBuilder()
    const templateEngine = new TemplateEngineRouter()

    const pdfDocumentArtifactStore = new LocalPdfDocumentArtifactStore(
      outputDir,
      tenantId
    )

    const eventPublisher = new ConsoleEventPublisher()

    const useCase = new GeneratePdfDocument(
      pdfDocumentRepository,
      pdfDocumentArtifactStore,
      templateRepository,
      templateEngine,
      pdfBuilder,
      eventPublisher
    )

    return new GeneratePdfDocumentController(useCase, pdfDocumentArtifactStore)
  }

  private static getPayrollCredentials(): Credentials {
    return {
      host: process.env.PAYROLL_DB_HOST ?? process.env.PGHOST ?? '',
      port: process.env.PAYROLL_DB_PORT ?? process.env.PGPORT,
      user: process.env.PAYROLL_DB_USER ?? process.env.PGUSER ?? '',
      password: process.env.PAYROLL_DB_PASSWORD ?? process.env.PGPASSWORD ?? '',
      database:
        process.env.PAYROLL_DB_NAME ?? process.env.PGDATABASE ?? 'payroll'
    }
  }
}
