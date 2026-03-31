import { Entity, UniqueEntityID, WithId } from '@libs/core'
import {
  TemplateEngine,
  TemplateRenderEngine
} from '../interfaces/TemplateEngine'
import { ReceiptTemplatePrintConfig } from '../vo/ReceiptTemplatePrintConfig'

type ReceiptTemplateProps = {
  name: string
  body: string
  header: string
  footer: string
  engine?: TemplateRenderEngine
  printConfig?: ReceiptTemplatePrintConfig
}

export type RenderedReceiptTemplate = {
  body: string
  header: string
  footer: string
  printConfig?: Record<string, unknown>
}

export class ReceiptTemplate extends Entity<ReceiptTemplateProps> {
  static create(props: ReceiptTemplateProps): ReceiptTemplate {
    return new ReceiptTemplate(props)
  }

  static recreateFromPersistence(
    props: WithId<ReceiptTemplateProps>
  ): ReceiptTemplate {
    return new ReceiptTemplate(props, new UniqueEntityID(props.id))
  }

  render(
    data: Record<string, unknown>,
    engine: TemplateEngine
  ): RenderedReceiptTemplate {
    return {
      body: engine.render(this.props.body, data, {
        engine: this.props.engine
      }),
      header: engine.render(this.props.header, data, {
        engine: this.props.engine
      }),
      footer: engine.render(this.props.footer, data, {
        engine: this.props.engine
      }),
      printConfig: this.props.printConfig?.toPrimitives()
    }
  }
}
