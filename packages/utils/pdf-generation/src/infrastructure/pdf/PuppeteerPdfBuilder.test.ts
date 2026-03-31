import { describe, expect, it, vi } from 'vitest'
import { PdfDocumentArtifact } from '../../domain/vo/PdfDocumentArtifact'
import puppeteer from './__mocks__/puppeteer-core'

vi.mock('puppeteer-core', () => ({ default: puppeteer }))
import { PuppeteerPdfBuilder } from './PuppeteerPdfBuilder'

describe('PuppeteerPdfBuilder', () => {
  it('should build templates into PDF', async () => {
    const result = await new PuppeteerPdfBuilder().build({
      body: '<h1>Foo Bar</h1>',
      header: '<h1>Header</h1>',
      footer: '<h1>Footer</h1>'
    })

    expect(result).toBeInstanceOf(PdfDocumentArtifact)

    const { meta } = result.toPrimitives()
    expect(result.content.toString()).toContain('%PDF-FAKE')
    expect(meta?.mimeType).toBe('application/pdf')
  })
})
