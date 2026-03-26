// factories/pdfGenerationFactory.ts
import {
  DynamoPdfDocumentRepository,
  DynamoTemplateRepository,
  HandlebarsTemplateEngine,
  PuppeteerPdfBuilder,
  S3PdfDocumentArtifactStore,
  GeneratePdfDocument,
} from '@contexts/pdf-generation'
import { EventBridgeEventPublisher } from '@libs/common-infra'
import { dynamoClient, s3Client, eventBridgeClient } from '@libs/common-infra'

export class PdfGenerationFactory {
  static create(tenantId: string) {
    const pdfDocumentRepository = new DynamoPdfDocumentRepository(
      dynamoClient,
      process.env.DYNAMO_PDF_TABLE_NAME!,
      tenantId
    )

    const templateRepository = new DynamoTemplateRepository(
      dynamoClient,
      process.env.DYNAMO_TEMPLATE_TABLE_NAME!,
      tenantId
    )

    const pdfBuilder = new PuppeteerPdfBuilder()
    const templateEngine = new HandlebarsTemplateEngine()

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
      pdfDocumentArtifactStore,
    }
  }
}
