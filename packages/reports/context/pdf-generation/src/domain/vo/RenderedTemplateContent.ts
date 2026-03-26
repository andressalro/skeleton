import { ValueObject } from '@libs/core'

export class RenderedTemplateContent extends ValueObject<{
  body: string // HTML or any template format
  header: string
  footer: string
}> {
  static create(props: {
    body: string
    header: string
    footer: string
  }): RenderedTemplateContent {
    return new RenderedTemplateContent({ ...props })
  }
}
