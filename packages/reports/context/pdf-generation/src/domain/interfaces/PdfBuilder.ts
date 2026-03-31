import { RenderedReceiptTemplate } from '../entities/ReceiptTemplate'
import { PdfDocumentArtifact } from '../vo/PdfDocumentArtifact'

export interface PdfBuilder {
  build(renderedContent: RenderedReceiptTemplate): Promise<PdfDocumentArtifact>
}
