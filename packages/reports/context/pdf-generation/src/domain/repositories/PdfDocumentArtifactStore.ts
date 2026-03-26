import { PdfDocumentArtifact } from '../vo/PdfDocumentArtifact'

export interface PdfDocumentArtifactStore {
  save(artifact: PdfDocumentArtifact): Promise<void>

  getPublicTempUrl(
    artifact: PdfDocumentArtifact,
    durationInSeconds: number
  ): Promise<string>
}
