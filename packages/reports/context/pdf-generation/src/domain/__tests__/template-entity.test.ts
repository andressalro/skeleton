import { describe, expect, it, vi } from 'vitest'
import { Template } from '../Template'
import { TemplateContent } from '../vo/TemplateContent'
import { TemplateEngine } from '../interfaces/TemplateEngine'

describe('Template', () => {
  it('should render a template string with given data', () => {
    class MockTemplateEngine implements TemplateEngine {
      render = vi.fn().mockReturnValue('Foo Bar')
    }

    const result = new MockTemplateEngine().render('<h1>Foo {{name}}</h1>', {
      name: 'Bar',
    })

    expect(result).toBe('Foo Bar')
  })

  it('should call engine.render with template and data when interpolating', () => {
    // recibe string y data, devuelve string
    const engine: TemplateEngine = {
      render: vi.fn().mockReturnValue('Foo Bar'),
    }

    const template = Template.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      content: new TemplateContent({
        body: '<h1>Foo {{name}}</h1>',
        header: '<h1>Foo {{name}}</h1>',
        footer: '<h1>Foo {{name}}</h1>',
      }),
    })

    const result = template.render({ name: 'Bar' }, engine)

    expect(engine.render).toHaveBeenCalledWith('<h1>Foo {{name}}</h1>', {
      name: 'Bar',
    })
    expect(result.toPrimitives().body).toBe('Foo Bar')
    expect(result.toPrimitives().header).toBe('Foo Bar')
    expect(result.toPrimitives().footer).toBe('Foo Bar')
  })
})
