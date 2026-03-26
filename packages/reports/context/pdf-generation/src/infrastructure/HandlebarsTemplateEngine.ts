import { TemplateEngine } from '../domain/interfaces/TemplateEngine'
import Handlebars from 'handlebars'

export class HandlebarsTemplateEngine implements TemplateEngine {
  constructor() {
    Handlebars.registerHelper({
      upper: function (text) {
        return text.toUpperCase()
      },
      lower: function (text) {
        return text.toLowerCase()
      },
      currency: function (value, locale = 'en') {
        return new Intl.NumberFormat(locale, {
          minimumFractionDigits: 2,
        }).format(value / 100)
      },
    })
  }

  render(template: string, data: Record<string, unknown>): string {
    const compiledTemplate = Handlebars.compile(template)
    return compiledTemplate(data)
  }
}
