import { DomainError } from '@libs/core'

export class ReceiptTemplateNotFoundError extends DomainError {
  public readonly name = 'ReceiptTemplateNotFoundError'
  constructor(templateId: string) {
    super(`Receipt template with ID ${templateId} not found`, { templateId })
  }
}
