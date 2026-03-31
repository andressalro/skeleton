import { ValueObject } from '@libs/core'

export type ReceiptTemplatePrintConfigProps = {
  top?: string
  bottom?: string
  left?: string
  right?: string
  format?: string
  landscape?: boolean
  printBackground?: boolean
  displayHeaderFooter?: boolean
  preferCSSPageSize?: boolean
}

export class ReceiptTemplatePrintConfig extends ValueObject<ReceiptTemplatePrintConfigProps> {
  static create(
    props?: ReceiptTemplatePrintConfigProps
  ): ReceiptTemplatePrintConfig | undefined {
    if (!props) {
      return undefined
    }

    return new ReceiptTemplatePrintConfig(props)
  }
}
