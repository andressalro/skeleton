import { Template } from '../Template'

export interface TemplateRepository {
  findById(id: string): Promise<Template | null>
}
