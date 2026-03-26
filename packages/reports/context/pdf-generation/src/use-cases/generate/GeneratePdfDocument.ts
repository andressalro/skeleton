import { EventPublisher, UseCase } from '@libs/core'
import { GeneratePdfDocumentCommand } from './GeneratePdfDocumentCommand'
import { TemplateNotFoundError } from '../../domain/errors/TemplateNotFound'
import { TemplateRepository } from '../../domain/repositories/TemplateRepository'
import { PdfDocumentRepository } from '../../domain/repositories/PdfDocumentRepository'
import { PdfDocument } from '../../domain/PdfDocument'
import { PdfRawData } from '../../domain/vo/PdfRawData'
import { PdfDocumentArtifactStore } from '../../domain/repositories/PdfDocumentArtifactStore'
import { TemplateEngine } from '../../domain/interfaces/TemplateEngine'
import { PdfBuilder } from '../../domain/interfaces/PdfBuilder'

export class GeneratePdfDocument
  implements UseCase<GeneratePdfDocumentCommand, PdfDocument>
{
  constructor(
    private readonly pdfDocumentRepository: PdfDocumentRepository,
    private readonly pdfDocumentArtifactStore: PdfDocumentArtifactStore,
    private readonly templateRepository: TemplateRepository,
    private readonly templateEngine: TemplateEngine,
    private readonly pdfBuilder: PdfBuilder,
    private readonly eventPublisher: EventPublisher
  ) {}
  async execute(command: GeneratePdfDocumentCommand) {
    const template = await this.templateRepository.findById(command.template)

    if (!template) {
      throw new TemplateNotFoundError(command.template)
    }

    const pdfDocument = PdfDocument.create({
      template,
      data: PdfRawData.create(command.data),
    })

    await pdfDocument.build(
      this.templateEngine,
      this.pdfBuilder,
      this.pdfDocumentArtifactStore
    )

    await this.pdfDocumentRepository.save(pdfDocument)

    this.eventPublisher.publish(pdfDocument.pullDomainEvents())
    return pdfDocument
  }
}
