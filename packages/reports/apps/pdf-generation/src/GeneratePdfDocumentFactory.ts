// factories/pdfGenerationFactory.ts
import {
  DynamoPdfDocumentRepository,
  GeneratePdfDocument,
  PgWrapper,
  PostgresReceiptTemplateRepository,
  PuppeteerPdfBuilder,
  S3PdfDocumentArtifactStore,
  TemplateEngineRouter,
  type Credentials
} from '@contexts/pdf-generation'
import { EventBridgeEventPublisher } from '@libs/common-infra'
import { dynamoClient, s3Client, eventBridgeClient } from '@libs/common-infra'
import { LocalPdfDocumentArtifactStore } from './local/LocalPdfDocumentArtifactStore'
import { LocalPdfDocumentRepository } from './local/LocalPdfDocumentRepository'
import { NullTemplateRepository } from './local/NullTemplateRepository'
import { ConsoleEventPublisher } from './local/ConsoleEventPublisher'

export class PdfGenerationFactory {
  static create(tenantId: string) {
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

    return {
      useCase,
      pdfDocumentArtifactStore
    }
  }

  private static createLocal(tenantId: string) {
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

    return {
      useCase,
      pdfDocumentArtifactStore
    }
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
