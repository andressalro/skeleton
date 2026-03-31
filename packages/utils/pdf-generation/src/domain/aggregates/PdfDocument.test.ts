import { describe, expect, it } from 'vitest'
import { ReceiptTemplate } from '../entities/ReceiptTemplate'
import { PdfDocument } from './PdfDocument'
import { PdfDocumentArtifact } from '../vo/PdfDocumentArtifact'
import { PdfRawData } from '../vo/PdfRawData'
import { PdfDocumentStatus } from '../vo/PdfDocumentStatus'
import { PdfDocumentGenerated } from '../events/PdfDocumentGenerated'

describe('PdfDocument', () => {
  it('can be created from a template and data', () => {
    const template = ReceiptTemplate.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      body: '<h1>Foo {{name}}</h1>',
      header: '<h1>Foo {{name}}</h1>',
      footer: '<h1>Foo {{name}}</h1>'
    })
    const pdfDocument = PdfDocument.create({
      template,
      data: PdfRawData.create({ name: 'Bar' })
    })

    expect(pdfDocument).toBeInstanceOf(PdfDocument)
  })

  it('should have status PENDING when created', () => {
    const template = ReceiptTemplate.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      body: '<h1>Foo {{name}}</h1>',
      header: '<h1>Foo {{name}}</h1>',
      footer: '<h1>Foo {{name}}</h1>'
    })
    const pdfDocument = PdfDocument.create({
      template,
      data: PdfRawData.create({ name: 'Bar' })
    })

    expect(pdfDocument.status).toBe(PdfDocumentStatus.PENDING)
  })

  it('should change status to GENERATING when generation starts', () => {
    const template = ReceiptTemplate.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      body: '<h1>Foo {{name}}</h1>',
      header: '<h1>Foo {{name}}</h1>',
      footer: '<h1>Foo {{name}}</h1>'
    })
    const pdfDocument = PdfDocument.create({
      template,
      data: PdfRawData.create({ name: 'Bar' })
    })

    expect(pdfDocument.status).toBe(PdfDocumentStatus.PENDING)
    pdfDocument.startGeneration()

    expect(pdfDocument.status).toBe(PdfDocumentStatus.GENERATING)
  })

  it('should change status to GENERATED after completing generation', () => {
    const template = ReceiptTemplate.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      body: '<h1>Foo {{name}}</h1>',
      header: '<h1>Foo {{name}}</h1>',
      footer: '<h1>Foo {{name}}</h1>'
    })
    const pdfDocument = PdfDocument.create({
      template,
      data: PdfRawData.create({ name: 'Bar' })
    })

    const artifact = PdfDocumentArtifact.create({
      content: Buffer.from('%PDF-1.4...')
    })

    pdfDocument.startGeneration()
    pdfDocument.completeGeneration(artifact)

    expect(pdfDocument.status).toBe(PdfDocumentStatus.GENERATED)
    expect(pdfDocument.artifact).toBe(artifact)
  })

  it('should change status to FAILED if generation fails', () => {
    const template = ReceiptTemplate.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      body: '<h1>Foo {{name}}</h1>',
      header: '<h1>Foo {{name}}</h1>',
      footer: '<h1>Foo {{name}}</h1>'
    })
    const pdfDocument = PdfDocument.create({
      template,
      data: PdfRawData.create({ name: 'Bar' })
    })

    expect(pdfDocument.status).toBe(PdfDocumentStatus.PENDING)
    pdfDocument.startGeneration()
    pdfDocument.failGeneration('PDF generation failed')

    expect(pdfDocument.status).toBe(PdfDocumentStatus.FAILED)

    expect(pdfDocument.toPrimitives().failedReason).toBe(
      'PDF generation failed'
    )
  })

  it('should emit PDFDocument.Generated event after completing generation', () => {
    const template = ReceiptTemplate.recreateFromPersistence({
      id: 'template-1',
      name: 'Test Template',
      body: '<h1>Foo {{name}}</h1>',
      header: '<h1>Foo {{name}}</h1>',
      footer: '<h1>Foo {{name}}</h1>'
    })
    const pdfDocument = PdfDocument.create({
      template,
      data: PdfRawData.create({ name: 'Bar' })
    })

    pdfDocument.startGeneration()
    pdfDocument.completeGeneration(
      PdfDocumentArtifact.create({
        content: Buffer.from('%PDF-1.4...')
      })
    )

    const events = pdfDocument.pullDomainEvents()
    expect(events).toHaveLength(1)
    expect(events[0]).toBeInstanceOf(PdfDocumentGenerated)
    expect(events[0].aggregateId).toBe(pdfDocument.id)
  })
})
