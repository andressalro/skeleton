import { ValueObject } from '@libs/core'

export class PdfRawData extends ValueObject<{
  rawData: Record<string, unknown>
}> {
  static create(rawData: Record<string, unknown>): PdfRawData {
    // add any validation if needed
    return new PdfRawData({ rawData })
  }
}
