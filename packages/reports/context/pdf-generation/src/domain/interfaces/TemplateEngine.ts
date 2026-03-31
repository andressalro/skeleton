export type TemplateRenderEngine = 'handlebars' | 'ejs'

export type TemplateRenderOptions = {
  engine?: TemplateRenderEngine
}

export interface TemplateEngine {
  render(
    template: string,
    data: Record<string, unknown>,
    options?: TemplateRenderOptions
  ): string
}
