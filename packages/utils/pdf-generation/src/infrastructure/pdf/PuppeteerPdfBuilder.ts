import { existsSync } from 'node:fs'
import puppeteer, { type PaperFormat } from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

import {
  PdfBuilder,
  RenderedReceiptTemplate
} from '../../application/use-cases/generate-pdf-document/types'
import { PdfDocumentArtifact } from '../../domain/vo/PdfDocumentArtifact'

export class PuppeteerPdfBuilder implements PdfBuilder {
  async build(
    renderedContent: RenderedReceiptTemplate
  ): Promise<PdfDocumentArtifact> {
    console.log('Building PDF document...')
    const chromiumExecutablePath = await this.resolveExecutablePath()

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: {
        deviceScaleFactor: 2,
        hasTouch: false,
        height: 1080,
        isLandscape: true,
        isMobile: false,
        width: 1920
      },
      executablePath: chromiumExecutablePath,
      headless: true
    })

    const { body, header, footer, printConfig } = renderedContent

    const page = await browser.newPage()

    await page.setContent(body, { waitUntil: 'networkidle0' })

    const normalizedPrintConfig = this.normalizePrintConfig(printConfig)

    const pdf = await page.pdf({
      format: normalizedPrintConfig.format,
      landscape: normalizedPrintConfig.landscape,
      margin: normalizedPrintConfig.margin,
      printBackground: normalizedPrintConfig.printBackground,
      displayHeaderFooter: normalizedPrintConfig.displayHeaderFooter,
      preferCSSPageSize: normalizedPrintConfig.preferCSSPageSize,
      headerTemplate: header || '',
      footerTemplate: footer || ''
    })
    const pdfBuffer = Buffer.from(pdf)

    await browser.close()
    return new PdfDocumentArtifact({
      content: pdfBuffer,
      filename: `document-${Date.now()}.pdf`,
      meta: {
        generatedAt: new Date(),
        size: pdfBuffer.length,
        mimeType: 'application/pdf'
      }
    })
  }

  private normalizePrintConfig(printConfig?: Record<string, unknown>) {
    const top = this.normalizeMarginValue(printConfig?.top)
    const bottom = this.normalizeMarginValue(printConfig?.bottom)
    const left = this.normalizeMarginValue(printConfig?.left)
    const right = this.normalizeMarginValue(printConfig?.right)

    return {
      format: this.normalizeFormat(printConfig?.format),
      landscape:
        typeof printConfig?.landscape === 'boolean'
          ? printConfig.landscape
          : false,
      printBackground:
        typeof printConfig?.printBackground === 'boolean'
          ? printConfig.printBackground
          : true,
      displayHeaderFooter:
        typeof printConfig?.displayHeaderFooter === 'boolean'
          ? printConfig.displayHeaderFooter
          : true,
      preferCSSPageSize:
        typeof printConfig?.preferCSSPageSize === 'boolean'
          ? printConfig.preferCSSPageSize
          : false,
      margin: {
        top,
        bottom,
        left,
        right
      }
    }
  }

  private normalizeMarginValue(value: unknown) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      return '0.5in'
    }

    const normalizedValue = value.trim()

    if (/^\d+(\.\d+)?$/.test(normalizedValue)) {
      return `${normalizedValue}in`
    }

    return normalizedValue
  }

  private normalizeFormat(value: unknown): PaperFormat {
    const normalizedValue =
      typeof value === 'string' && value.trim().length > 0
        ? value.trim().toLowerCase()
        : 'letter'

    const supportedFormats: PaperFormat[] = [
      'a0',
      'a1',
      'a2',
      'a3',
      'a4',
      'a5',
      'a6',
      'legal',
      'letter',
      'tabloid',
      'ledger'
    ]

    return supportedFormats.includes(normalizedValue as PaperFormat)
      ? (normalizedValue as PaperFormat)
      : 'letter'
  }

  private async resolveExecutablePath() {
    if (process.env.CHROMIUM_EXECUTABLE_PATH) {
      if (existsSync(process.env.CHROMIUM_EXECUTABLE_PATH)) {
        return process.env.CHROMIUM_EXECUTABLE_PATH
      }

      console.warn(
        `CHROMIUM_EXECUTABLE_PATH does not exist: ${process.env.CHROMIUM_EXECUTABLE_PATH}. Falling back to auto-detection.`
      )
    }

    const localExecutablePath = this.resolveLocalExecutablePath()
    if (localExecutablePath) {
      return localExecutablePath
    }

    return chromium.executablePath()
  }

  private resolveLocalExecutablePath() {
    const candidates =
      process.platform === 'win32'
        ? [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
            'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
          ]
        : [
            '/usr/bin/chromium',
            '/usr/bin/chromium-browser',
            '/usr/bin/google-chrome',
            '/snap/bin/chromium'
          ]

    return candidates.find((candidate) => existsSync(candidate))
  }
}
