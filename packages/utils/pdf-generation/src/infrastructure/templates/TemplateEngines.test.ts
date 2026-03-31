import { describe, expect, it } from 'vitest'

import { EjsTemplateEngine } from './EjsTemplateEngine'
import { HandlebarsTemplateEngine } from './HandlebarsTemplateEngine'
import { TemplateEngineRouter } from './TemplateEngineRouter'

describe('HandlebarsTemplateEngine', () => {
  it('should interpolate handlebars variables correctly', () => {
    const result = new HandlebarsTemplateEngine().render(
      '<h1>Foo {{name}}</h1>',
      {
        name: 'Bar'
      }
    )

    expect(result).toBe('<h1>Foo Bar</h1>')
  })
})

describe('EjsTemplateEngine', () => {
  it('should interpolate ejs variables correctly', () => {
    const result = new EjsTemplateEngine().render('<h1>Foo <%= name %></h1>', {
      name: 'Bar'
    })

    expect(result).toBe('<h1>Foo Bar</h1>')
  })
})

describe('TemplateEngineRouter', () => {
  it('should select the requested engine', () => {
    const result = new TemplateEngineRouter().render(
      '<h1>Foo <%= name %></h1>',
      {
        name: 'Bar'
      },
      {
        engine: 'ejs'
      }
    )

    expect(result).toBe('<h1>Foo Bar</h1>')
  })
})
