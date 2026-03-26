export interface TemplateEngine {
  render(template: string, data: Record<string, unknown>): string
}
