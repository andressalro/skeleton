import { PdfDocument } from '../../../domain/aggregates/PdfDocument'
import { PdfDocumentArtifactStore } from '../../../domain/interfaces/PdfDocumentArtifactStore'
import { PdfBuilder, RenderedReceiptTemplate, TemplateEngine } from './types'

export class PdfDocumentGenerationService {
  constructor(
    private readonly pdfDocumentArtifactStore: PdfDocumentArtifactStore,
    private readonly templateEngine: TemplateEngine,
    private readonly pdfBuilder: PdfBuilder
  ) {}

  async build(pdfDocument: PdfDocument): Promise<void> {
    pdfDocument.startGeneration()

    try {
      const renderedTemplate = this.renderTemplate(
        pdfDocument.template,
        pdfDocument.data.toPrimitives().rawData
      )
      const pdfArtifact = await this.pdfBuilder.build(renderedTemplate)

      await this.pdfDocumentArtifactStore.save(pdfArtifact)

      pdfDocument.completeGeneration(pdfArtifact)
    } catch (error) {
      pdfDocument.failGeneration((error as Error).message)
      throw error
    }
  }

  private renderTemplate(
    template: PdfDocument['template'],
    data: Record<string, unknown>
  ): RenderedReceiptTemplate {
    return {
      body: this.templateEngine.render(template.body, data, {
        engine: template.engine
      }),
      header: this.templateEngine.render(template.header, data, {
        engine: template.engine
      }),
      footer: this.templateEngine.render(template.footer, data, {
        engine: template.engine
      }),
      printConfig: template.printConfig?.toPrimitives()
    }
  }
}
