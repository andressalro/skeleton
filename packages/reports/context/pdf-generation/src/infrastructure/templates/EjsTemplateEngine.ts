import ejs from 'ejs'

import { TemplateEngine } from '../../domain/interfaces/TemplateEngine'

export class EjsTemplateEngine implements TemplateEngine {
  render(template: string, data: Record<string, unknown>): string {
    return ejs.render(template, data, {
      async: false
    })
  }
}
