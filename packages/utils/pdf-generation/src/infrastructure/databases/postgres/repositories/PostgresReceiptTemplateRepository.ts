import { ReceiptTemplate } from '../../../../domain/entities/ReceiptTemplate'
import { ReceiptTemplateRepository } from '../../../../domain/interfaces/ReceiptTemplateRepository'
import { ReceiptTemplatePrintConfig } from '../../../../domain/vo/ReceiptTemplatePrintConfig'
import { Connection } from '../Connection'

type ReceiptTemplateRow = {
  id: string
  name: string
  body_template: string
  header_template: string | null
  footer_template: string | null
  print_config: string | Record<string, unknown> | null
}

export class PostgresReceiptTemplateRepository implements ReceiptTemplateRepository {
  constructor(private readonly connection: Connection) {}

  async findById(templateId: string): Promise<ReceiptTemplate | null> {
    const rows = await this.connection.execute<ReceiptTemplateRow>(
      `SELECT
        id,
        name,
        body_template,
        header_template,
        footer_template,
        print_config
      FROM receipt_templates
      WHERE id = ${this.toSqlStringLiteral(templateId)}
        AND is_deleted = false
      LIMIT 1`
    )

    const row = rows[0]

    if (!row) {
      return null
    }

    return ReceiptTemplate.recreateFromPersistence({
      id: row.id,
      name: row.name,
      body: row.body_template,
      header: row.header_template ?? '<div></div>',
      footer: row.footer_template ?? '<div></div>',
      engine: 'ejs',
      printConfig: ReceiptTemplatePrintConfig.create(
        this.parsePrintConfig(row.print_config)
      )
    })
  }

  private parsePrintConfig(
    value: ReceiptTemplateRow['print_config']
  ): Record<string, unknown> | undefined {
    if (!value) {
      return undefined
    }

    if (typeof value === 'string') {
      return JSON.parse(value) as Record<string, unknown>
    }

    return value
  }

  private toSqlStringLiteral(value: string): string {
    return `'${value.replace(/'/g, "''")}'`
  }
}
