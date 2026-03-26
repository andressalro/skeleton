import { DomainError } from '@libs/core'

export class TemplateNotFoundError extends DomainError {
  public readonly name = 'TemplateNotFoundError'
  constructor(templateId: string) {
    super(`Template with ID ${templateId} not found`, { templateId })
  }
}
