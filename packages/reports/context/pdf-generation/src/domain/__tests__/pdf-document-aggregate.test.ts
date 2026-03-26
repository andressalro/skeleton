import { describe, expect, it, vi } from 'vitest'
import { Template } from '../Template'
import { TemplateContent } from '../vo/TemplateContent'
import { PdfDocument } from '../PdfDocument'
import { PdfDocumentArtifact } from '../vo/PdfDocumentArtifact'
import { PdfBuilder } from '../interfaces/PdfBuilder'
import { PdfRawData } from '../vo/PdfRawData'
import { PdfDocumentStatus } from '../vo/PdfDocumentStatus'
import { PdfDocumentGenerated } from '../events/PdfDocumentGenerated'
import { PdfDocumentArtifactStore } from '../repositories/PdfDocumentArtifactStore'

const pdfDocumentArtifactStore: PdfDocumentArtifactStore = {
  save: vi.fn().mockResolvedValue(Promise.resolve()),
  getPublicTempUrl: vi.fn().mockResolvedValue('http://example.com/temp-url'),
}

describe('PdfDocument', () => {
  it('can be created from a template and data', () => {
    const template = Template.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      content: new TemplateContent({
        body: '<h1>Foo {{name}}</h1>',
        header: '<h1>Foo {{name}}</h1>',
        footer: '<h1>Foo {{name}}</h1>',
      }),
    })
    const pdfDocument = PdfDocument.create({
      template,
      data: PdfRawData.create({ name: 'Bar' }),
    })

    expect(pdfDocument).toBeInstanceOf(PdfDocument)
  })

  it('should have status PENDING when created', () => {
    const template = Template.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      content: new TemplateContent({
        body: '<h1>Foo {{name}}</h1>',
        header: '<h1>Foo {{name}}</h1>',
        footer: '<h1>Foo {{name}}</h1>',
      }),
    })
    const pdfDocument = PdfDocument.create({
      template,
      data: PdfRawData.create({ name: 'Bar' }),
    })

    expect(pdfDocument.status).toBe(PdfDocumentStatus.PENDING)
  })

  it('should change status to GENERATED after successful PDF build', async () => {
    const template = Template.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      content: new TemplateContent({
        body: '<h1>Foo {{name}}</h1>',
        header: '<h1>Foo {{name}}</h1>',
        footer: '<h1>Foo {{name}}</h1>',
      }),
    })
    const pdfDocument = PdfDocument.create({
      template,
      data: PdfRawData.create({ name: 'Bar' }),
    })

    expect(pdfDocument.status).toBe(PdfDocumentStatus.PENDING)
    // renderer , pdf builder
    const templateEngine = { render: () => '<h1>Foo Bar</h1>' }
    const pdfBuilder: PdfBuilder = {
      build: () =>
        Promise.resolve(
          PdfDocumentArtifact.create({
            content: Buffer.from('%PDF-1.4...'),
          })
        ),
    }

    await pdfDocument.build(
      templateEngine,
      pdfBuilder,
      pdfDocumentArtifactStore
    )

    expect(pdfDocument.status).toBe(PdfDocumentStatus.GENERATED)
  })

  it('should change status to FAILED if PDF build fails', async () => {
    const template = Template.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      content: new TemplateContent({
        body: '<h1>Foo {{name}}</h1>',
        header: '<h1>Foo {{name}}</h1>',
        footer: '<h1>Foo {{name}}</h1>',
      }),
    })
    const pdfDocument = PdfDocument.create({
      template,
      data: PdfRawData.create({ name: 'Bar' }),
    })

    expect(pdfDocument.status).toBe(PdfDocumentStatus.PENDING)
    // renderer , pdf builder
    const templateEngine = { render: () => '<h1>Foo Bar</h1>' }
    const pdfBuilder: PdfBuilder = {
      build: () => Promise.reject(new Error('PDF generation failed')),
    }
    try {
      await pdfDocument.build(
        templateEngine,
        pdfBuilder,
        pdfDocumentArtifactStore
      )
    } catch (error) {
      // Expected to throw
      expect(error).toBeInstanceOf(Error)
    }

    expect(pdfDocument.status).toBe(PdfDocumentStatus.FAILED)

    expect(pdfDocument.toPrimitives().failedReason).toBe(
      'PDF generation failed'
    )
  })

  it('should emit PDFDocument.Generated event after successful PDF build', async () => {
    const template = Template.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      content: new TemplateContent({
        body: '<h1>Foo {{name}}</h1>',
        header: '<h1>Foo {{name}}</h1>',
        footer: '<h1>Foo {{name}}</h1>',
      }),
    })
    const pdfDocument = PdfDocument.create({
      template,
      data: PdfRawData.create({ name: 'Bar' }),
    })

    // renderer , pdf builder
    const templateEngine = { render: () => '<h1>Foo Bar</h1>' }
    const pdfBuilder: PdfBuilder = {
      build: () =>
        Promise.resolve(
          PdfDocumentArtifact.create({
            content: Buffer.from('%PDF-1.4...'),
          })
        ),
    }
    const pdfDocumentArtifactStore: PdfDocumentArtifactStore = {
      save: vi.fn().mockResolvedValue(Promise.resolve()),
      getPublicTempUrl: vi
        .fn()
        .mockResolvedValue('http://example.com/temp-url'),
    }
    await pdfDocument.build(
      templateEngine,
      pdfBuilder,
      pdfDocumentArtifactStore
    )

    const events = pdfDocument.pullDomainEvents()
    expect(events).toHaveLength(1)
    expect(events[0]).toBeInstanceOf(PdfDocumentGenerated)
    expect(events[0].aggregateId).toBe(pdfDocument.id)
  })
})
