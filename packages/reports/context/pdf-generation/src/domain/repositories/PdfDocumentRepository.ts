import { PdfDocument } from '../aggregates/PdfDocument'

export interface PdfDocumentRepository {
  save(document: PdfDocument): Promise<void>
}
