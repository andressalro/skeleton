import { PdfDocument } from '../PdfDocument'

export interface PdfDocumentRepository {
  save(document: PdfDocument): Promise<void>
}
