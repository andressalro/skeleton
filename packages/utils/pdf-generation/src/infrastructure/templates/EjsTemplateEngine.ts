import ejs from 'ejs'

import { TemplateEngine } from '../../application/use-cases/generate-pdf-document/types'

export class EjsTemplateEngine implements TemplateEngine {
  render(template: string, data: Record<string, unknown>): string {
    return ejs.render(template, data, {
      async: false
    })
  }
}
