import { Entity, UniqueEntityID, WithId } from '@libs/core'
import { TemplateEngine } from './interfaces/TemplateEngine'
import { TemplateContent } from './vo/TemplateContent'
import { RenderedTemplateContent } from './vo/RenderedTemplateContent'

// export interface TemplateOptions {
//   filenamePattern?: string // e.g., "payslip-{employeeId}-{month}.pdf"
//   margins?: { top: string; bottom: string; left: string; right: string }
//   format?: 'A4' | 'Letter' | 'Legal'
//   orientation?: 'portrait' | 'landscape'
// }

type TemplateProps = {
  name: string
  content: TemplateContent
  // dataSchema?: Record<string, unknown> // JSON schema for validating data
  // options?: TemplateOptions
}

export class Template extends Entity<TemplateProps> {
  static recreateFromPersistence(props: WithId<TemplateProps>): Template {
    return new Template(props, new UniqueEntityID(props.id))
  }

  render(
    data: Record<string, unknown>,
    engine: TemplateEngine
  ): RenderedTemplateContent {
    return this.props.content.renderWith(data, engine)
  }
}
