import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

import { PdfBuilder } from '../domain/interfaces/PdfBuilder'
import { PdfDocumentArtifact } from '../domain/vo/PdfDocumentArtifact'
import { RenderedTemplateContent } from '../domain/vo/RenderedTemplateContent'

export class PuppeteerPdfBuilder implements PdfBuilder {
  async build(
    renderedContent: RenderedTemplateContent
  ): Promise<PdfDocumentArtifact> {
    console.log('Building PDF document...')
    const chromiumExecutablePath =
      process.env.CHROMIUM_EXECUTABLE_PATH ?? (await chromium.executablePath())

    const browser = await puppeteer.launch({
      args: chromium.args, // puppeteer.defaultArgs({ args: chromium.args, headless: 'shell' }),
      defaultViewport: {
        deviceScaleFactor: 2,
        hasTouch: false,
        height: 1080,
        isLandscape: true,
        isMobile: false,
        width: 1920,
      },
      executablePath: chromiumExecutablePath,
      headless: true,
    })

    const { body, header, footer } = renderedContent.toPrimitives()

    const page = await browser.newPage()

    await page.setContent(body, { waitUntil: 'networkidle0' })

    // Generar PDF
    const pdf = await page.pdf({
      format: 'letter',
      margin: {
        top: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
        right: '0.5in',
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: header || '',
      footerTemplate: footer || '',
    })
    const pdfBuffer = Buffer.from(pdf)

    await browser.close()
    return new PdfDocumentArtifact({
      content: pdfBuffer,
      filename: `document-${Date.now()}.pdf`,
      meta: {
        generatedAt: new Date(),
        size: pdfBuffer.length,
        mimeType: 'application/pdf',
      },
    })
  }
}
