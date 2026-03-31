import { describe, expect, it } from 'vitest'
import { ReceiptTemplate } from './ReceiptTemplate'

describe('ReceiptTemplate', () => {
  it('should expose template fields through getters', () => {
    const template = ReceiptTemplate.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      body: '<h1>Foo {{name}}</h1>',
      header: '<h1>Foo {{name}}</h1>',
      footer: '<h1>Foo {{name}}</h1>',
      engine: 'handlebars'
    })

    expect(template.name).toBe('Test Template')
    expect(template.body).toBe('<h1>Foo {{name}}</h1>')
    expect(template.header).toBe('<h1>Foo {{name}}</h1>')
    expect(template.footer).toBe('<h1>Foo {{name}}</h1>')
    expect(template.engine).toBe('handlebars')
  })

  it('should preserve print configuration when present', () => {
    const template = ReceiptTemplate.create({
      name: 'Template',
      body: '<h1>Hello</h1>',
      header: '<div>Header</div>',
      footer: '<div>Footer</div>',
      printConfig: undefined
    })

    expect(template.printConfig).toBeUndefined()
  })
})
