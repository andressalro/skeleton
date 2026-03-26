import { PdfDocumentArtifact } from '../vo/PdfDocumentArtifact'
import { RenderedTemplateContent } from '../vo/RenderedTemplateContent'

export interface PdfBuilder {
  build(renderedContent: RenderedTemplateContent): Promise<PdfDocumentArtifact>
}
