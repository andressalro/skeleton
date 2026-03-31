import { EventPublisher, UseCase } from '@libs/core'
import { GeneratePdfDocumentCommand } from './GeneratePdfDocumentCommand'
import { ResolveReceiptTemplate } from './ResolveReceiptTemplate'
import { ReceiptTemplateNotFoundError } from '../../domain/errors/ReceiptTemplateNotFound'
import { ReceiptTemplateRepository } from '../../domain/repositories/ReceiptTemplateRepository'
import { PdfDocumentRepository } from '../../domain/repositories/PdfDocumentRepository'
import { PdfDocument } from '../../domain/aggregates/PdfDocument'
import { PdfDocumentArtifactStore } from '../../domain/repositories/PdfDocumentArtifactStore'
import { TemplateEngine } from '../../domain/interfaces/TemplateEngine'
import { PdfBuilder } from '../../domain/interfaces/PdfBuilder'
import { PdfDocumentGenerationService } from './PdfDocumentGenerationService'
import { PdfRawData } from '../../domain/vo/PdfRawData'

export class GeneratePdfDocument implements UseCase<
  GeneratePdfDocumentCommand,
  PdfDocument
> {
  private readonly generationService: PdfDocumentGenerationService
  private readonly resolveReceiptTemplate: ResolveReceiptTemplate

  constructor(
    private readonly pdfDocumentRepository: PdfDocumentRepository,
    pdfDocumentArtifactStore: PdfDocumentArtifactStore,
    templateRepository: ReceiptTemplateRepository,
    templateEngine: TemplateEngine,
    pdfBuilder: PdfBuilder,
    private readonly eventPublisher: EventPublisher
  ) {
    this.resolveReceiptTemplate = new ResolveReceiptTemplate(templateRepository)
    this.generationService = new PdfDocumentGenerationService(
      pdfDocumentArtifactStore,
      templateEngine,
      pdfBuilder
    )
  }

  async execute(command: GeneratePdfDocumentCommand) {
    const resolvedReceiptTemplate =
      await this.resolveReceiptTemplate.execute(command)

    if (!resolvedReceiptTemplate && typeof command.template === 'string') {
      throw new ReceiptTemplateNotFoundError(command.template)
    }

    if (!resolvedReceiptTemplate) {
      throw new Error('Receipt template could not be resolved')
    }

    const pdfDocument = PdfDocument.create({
      template: resolvedReceiptTemplate,
      data: PdfRawData.create(command.data)
    })

    try {
      await this.generationService.build(pdfDocument)
      await this.pdfDocumentRepository.save(pdfDocument)
      this.eventPublisher.publish(pdfDocument.pullDomainEvents())
      return pdfDocument
    } catch (error) {
      await this.pdfDocumentRepository.save(pdfDocument)
      throw error
    }
  }
}
