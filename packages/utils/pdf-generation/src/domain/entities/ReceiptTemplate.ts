import { Entity, UniqueEntityID, WithId } from '@libs/core'
import { ReceiptTemplatePrintConfig } from '../vo/ReceiptTemplatePrintConfig'

type TemplateRenderEngine = 'handlebars' | 'ejs'

type ReceiptTemplateProps = {
  name: string
  body: string
  header: string
  footer: string
  engine?: TemplateRenderEngine
  printConfig?: ReceiptTemplatePrintConfig
}

export class ReceiptTemplate extends Entity<ReceiptTemplateProps> {
  get name() {
    return this.props.name
  }

  get body() {
    return this.props.body
  }

  get header() {
    return this.props.header
  }

  get footer() {
    return this.props.footer
  }

  get engine() {
    return this.props.engine
  }

  get printConfig() {
    return this.props.printConfig
  }

  static create(props: ReceiptTemplateProps): ReceiptTemplate {
    return new ReceiptTemplate(props)
  }

  static recreateFromPersistence(
    props: WithId<ReceiptTemplateProps>
  ): ReceiptTemplate {
    return new ReceiptTemplate(props, new UniqueEntityID(props.id))
  }
}
