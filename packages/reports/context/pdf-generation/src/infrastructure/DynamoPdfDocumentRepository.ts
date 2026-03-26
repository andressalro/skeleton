import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

import { PdfDocument } from '../domain/PdfDocument'
import { PdfDocumentRepository } from '../domain/repositories/PdfDocumentRepository'

export class DynamoPdfDocumentRepository implements PdfDocumentRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
    private readonly tenantId: string
  ) {}

  async save(pdfDocument: PdfDocument): Promise<void> {
    const pdfDocumentPrimitives = pdfDocument.toPrimitives()

    const item = {
      PK: `TENANT#${this.tenantId}`,
      SK: `PDF#${pdfDocument.id}`,
      ...pdfDocumentPrimitives,
      template: pdfDocumentPrimitives.template.id, // Ensure template is stored as its ID
    }

    console.log('Saving PDF document:', item)
    console.log('Dynamo Item size', JSON.stringify(item).length / 1024 / 1024) // in mb

    await this.client
      .send(
        new PutCommand({
          TableName: this.tableName,
          Item: item,
        })
      )
      .catch((error) => {
        console.error('Error saving PDF document to DynamoDB:', error)
        throw error
      })
  }
}
