import { PdfDocument } from '../../domain/aggregates/PdfDocument'
import { PdfDocumentArtifactStore } from '../../domain/repositories/PdfDocumentArtifactStore'
import { TemplateEngine } from '../../domain/interfaces/TemplateEngine'
import { PdfBuilder } from '../../domain/interfaces/PdfBuilder'

export class PdfDocumentGenerationService {
  constructor(
    private readonly pdfDocumentArtifactStore: PdfDocumentArtifactStore,
    private readonly templateEngine: TemplateEngine,
    private readonly pdfBuilder: PdfBuilder
  ) {}

  async build(pdfDocument: PdfDocument): Promise<void> {
    pdfDocument.startGeneration()

    try {
      const renderedTemplate = pdfDocument.template.render(
        pdfDocument.data.toPrimitives().rawData,
        this.templateEngine
      )
      const pdfArtifact = await this.pdfBuilder.build(renderedTemplate)

      await this.pdfDocumentArtifactStore.save(pdfArtifact)

      pdfDocument.completeGeneration(pdfArtifact)
    } catch (error) {
      pdfDocument.failGeneration((error as Error).message)
      throw error
    }
  }
}
