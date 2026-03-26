import { describe, expect, it } from 'vitest'
import { S3PdfDocumentArtifactStore } from '../S3PdfDocumentArtifactStore'
import { PdfDocumentArtifact } from '../../domain/vo/PdfDocumentArtifact'
import { S3Client } from '@aws-sdk/client-s3'

import s3Client from './__mocks__/s3-client'

describe('S3PdfDocumentArtifactStore', () => {
  it('should load the document to S3', async () => {
    process.env.S3_BUCKET_NAME = 'fake-bucket'
    process.env.S3_FOLDER_NAME = 'fake-folder'

    const result = await new S3PdfDocumentArtifactStore(
      s3Client as unknown as S3Client,
      process.env.S3_BUCKET_NAME!,
      process.env.S3_FOLDER_NAME!,
      'fake-tenant'
    ).save(
      PdfDocumentArtifact.create({ content: Buffer.from('FAKE PDF CONTENT') })
    ) // void return

    expect(result).toBeUndefined()
  })
})
