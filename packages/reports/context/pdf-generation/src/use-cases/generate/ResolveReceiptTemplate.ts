import { ReceiptTemplate } from '../../domain/entities/ReceiptTemplate'
import { ReceiptTemplateRepository } from '../../domain/repositories/ReceiptTemplateRepository'
import { ReceiptTemplatePrintConfig } from '../../domain/vo/ReceiptTemplatePrintConfig'
import { GeneratePdfDocumentCommand } from './GeneratePdfDocumentCommand'

export class ResolveReceiptTemplate {
  constructor(
    private readonly receiptTemplateRepository: ReceiptTemplateRepository
  ) {}

  async execute(
    command: GeneratePdfDocumentCommand
  ): Promise<ReceiptTemplate | null> {
    if (typeof command.template === 'string') {
      return this.receiptTemplateRepository.findById(command.template)
    }

    return ReceiptTemplate.create({
      name: command.template.name ?? 'inline-template',
      body: command.template.body,
      header: command.template.header,
      footer: command.template.footer,
      engine: command.template.engine,
      printConfig: ReceiptTemplatePrintConfig.create(
        command.template.printConfig
      )
    })
  }
}
