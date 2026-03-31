import {
  TemplateEngine,
  TemplateRenderOptions
} from '../../application/use-cases/generate-pdf-document/types'
import { EjsTemplateEngine } from './EjsTemplateEngine'
import { HandlebarsTemplateEngine } from './HandlebarsTemplateEngine'

export class TemplateEngineRouter implements TemplateEngine {
  constructor(
    private readonly handlebarsTemplateEngine: TemplateEngine = new HandlebarsTemplateEngine(),
    private readonly ejsTemplateEngine: TemplateEngine = new EjsTemplateEngine()
  ) {}

  render(
    template: string,
    data: Record<string, unknown>,
    options?: TemplateRenderOptions
  ): string {
    const engine = options?.engine ?? 'handlebars'

    if (engine === 'ejs') {
      return this.ejsTemplateEngine.render(template, data)
    }

    return this.handlebarsTemplateEngine.render(template, data)
  }
}
