import { ReceiptTemplate, ReceiptTemplateRepository } from '../../../main'

export class NullTemplateRepository implements ReceiptTemplateRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findById(_id: string): Promise<ReceiptTemplate | null> {
    return null
  }
}
