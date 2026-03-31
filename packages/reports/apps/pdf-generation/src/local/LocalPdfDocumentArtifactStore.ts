import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { PdfDocumentArtifactStore, PdfDocumentArtifact } from '@contexts/pdf-generation'

export class LocalPdfDocumentArtifactStore implements PdfDocumentArtifactStore {
  constructor(
    private readonly outputDir: string,
    private readonly tenantId: string
  ) {}

  async save(artifact: PdfDocumentArtifact): Promise<void> {
    const directory = this.resolveTenantDirectory()
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, artifact.filename), artifact.content)
  }

  async getPublicTempUrl(artifact: PdfDocumentArtifact): Promise<string> {
    return path.join(this.resolveTenantDirectory(), artifact.filename)
  }

  private resolveTenantDirectory() {
    return path.resolve(this.outputDir, this.tenantId)
  }
}
