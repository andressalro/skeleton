import { PdfDocumentArtifactStore } from '../domain/repositories/PdfDocumentArtifactStore'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3' // Assuming AWS SDK is used for S3 interactions
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PdfDocumentArtifact } from '../domain/vo/PdfDocumentArtifact'

export class S3PdfDocumentArtifactStore implements PdfDocumentArtifactStore {
  constructor(
    private readonly client: S3Client,
    private readonly bucketName: string,
    private readonly baseFolderName: string,
    private readonly tenantId: string
  ) {}

  async save(artifact: PdfDocumentArtifact) {
    // Implementation for saving the artifact to S3

    const { filename, content } = artifact

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: `${this.baseFolderName}/${this.tenantId}/${filename}`,
        Body: content,
        ContentType: 'application/pdf',
      })
    )
  }
  async getPublicTempUrl(
    artifact: PdfDocumentArtifact,
    durationInSeconds: number
  ): Promise<string> {
    // Implementation for getting the public temporary URL from S3
    const { filename } = artifact.toPrimitives()
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: `${this.baseFolderName}/${this.tenantId}/${filename}`,
    })

    const url = await getSignedUrl(this.client, command, {
      expiresIn: durationInSeconds,
    })

    return url
  }
}
