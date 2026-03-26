import { ValueObject } from '@libs/core'

import { TemplateEngine } from '../interfaces/TemplateEngine'
import { RenderedTemplateContent } from './RenderedTemplateContent'

export class TemplateContent extends ValueObject<{
  body: string // HTML or any template format
  header: string
  footer: string
}> {
  renderWith(
    data: Record<string, unknown>,
    engine: TemplateEngine
  ): RenderedTemplateContent {
    return RenderedTemplateContent.create({
      body: engine.render(this.props.body, data),
      header: engine.render(this.props.header, data),
      footer: engine.render(this.props.footer, data),
    })
  }
}
