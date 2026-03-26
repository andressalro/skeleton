import { describe, expect, it } from 'vitest'
import { HandlebarsTemplateEngine } from '../HandlebarsTemplateEngine'

describe('HandlebarsTemplateEngine', () => {
  it('should interpolate handlebars variables correctly', () => {
    const result = new HandlebarsTemplateEngine().render(
      '<h1>Foo {{name}}</h1>',
      {
        name: 'Bar',
      }
    )
    expect(result).toBe('<h1>Foo Bar</h1>')
  })
})
