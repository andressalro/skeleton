import {
  ReceiptTemplate,
  ReceiptTemplateRepository
} from '@contexts/pdf-generation'

export class NullTemplateRepository implements ReceiptTemplateRepository {
  async findById(_id: string): Promise<ReceiptTemplate | null> {
    return null
  }
}
