import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { PdfDocumentRepository, PdfDocument } from '@contexts/pdf-generation'

export class LocalPdfDocumentRepository implements PdfDocumentRepository {
  constructor(
    private readonly outputDir: string,
    private readonly tenantId: string
  ) {}

  async save(document: PdfDocument): Promise<void> {
    const directory = path.resolve(this.outputDir, this.tenantId, 'metadata')
    await mkdir(directory, { recursive: true })

    const primitive = document.toPrimitives()
    await writeFile(
      path.join(directory, `${document.id.toString()}.json`),
      JSON.stringify(primitive, null, 2),
      'utf-8'
    )
  }
}
