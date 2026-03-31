import { PdfDocumentArtifact } from '../../../domain/vo/PdfDocumentArtifact'

export type TemplateRenderEngine = 'handlebars' | 'ejs'

export type TemplateRenderOptions = {
  engine?: TemplateRenderEngine
}

export interface TemplateEngine {
  render(
    template: string,
    data: Record<string, unknown>,
    options?: TemplateRenderOptions
  ): string
}

export type RenderedReceiptTemplate = {
  body: string
  header: string
  footer: string
  printConfig?: Record<string, unknown>
}

export interface PdfBuilder {
  build(renderedContent: RenderedReceiptTemplate): Promise<PdfDocumentArtifact>
}
