import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'

import { TemplateRepository } from '../domain/repositories/TemplateRepository'
import { Template } from '../domain/Template'
import { TemplateContent } from '../domain/vo/TemplateContent'

export class DynamoTemplateRepository implements TemplateRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
    private readonly tenantId: string
  ) {}

  async findById(templateId: string) {
    const item = {
      PK: `TENANT#${this.tenantId}`,
      SK: `TEMPLATE#${templateId}`,
    }

    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: item,
      })
    )

    if (!result.Item) {
      return null
    }

    return Template.recreateFromPersistence({
      id: result.Item.SK.replace('TEMPLATE#', ''),
      name: result.Item.name,
      content: new TemplateContent(result.Item.content),
    })
  }
}
