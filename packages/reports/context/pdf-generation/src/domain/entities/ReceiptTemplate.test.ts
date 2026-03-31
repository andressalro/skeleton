import { describe, expect, it, vi } from 'vitest'
import { ReceiptTemplate } from './ReceiptTemplate'
import { TemplateEngine } from '../interfaces/TemplateEngine'

describe('ReceiptTemplate', () => {
  it('should render a template string with given data', () => {
    class MockTemplateEngine implements TemplateEngine {
      render = vi.fn().mockReturnValue('Foo Bar')
    }

    const result = new MockTemplateEngine().render('<h1>Foo {{name}}</h1>', {
      name: 'Bar'
    })

    expect(result).toBe('Foo Bar')
  })

  it('should call engine.render with template and data when interpolating', () => {
    const engine: TemplateEngine = {
      render: vi.fn().mockReturnValue('Foo Bar')
    }

    const template = ReceiptTemplate.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      body: '<h1>Foo {{name}}</h1>',
      header: '<h1>Foo {{name}}</h1>',
      footer: '<h1>Foo {{name}}</h1>'
    })

    const result = template.render({ name: 'Bar' }, engine)

    expect(engine.render).toHaveBeenCalledWith(
      '<h1>Foo {{name}}</h1>',
      {
        name: 'Bar'
      },
      {
        engine: undefined
      }
    )
    expect(result.body).toBe('Foo Bar')
    expect(result.header).toBe('Foo Bar')
    expect(result.footer).toBe('Foo Bar')
  })
})
