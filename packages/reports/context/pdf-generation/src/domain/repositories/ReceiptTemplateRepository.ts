import { ReceiptTemplate } from '../entities/ReceiptTemplate'

export interface ReceiptTemplateRepository {
  findById(id: string): Promise<ReceiptTemplate | null>
}
