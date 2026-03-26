import { AggregateRoot } from '@libs/core'
import { Template } from './Template'
import { PdfRawData } from './vo/PdfRawData'
import { TemplateEngine } from './interfaces/TemplateEngine'
import { PdfBuilder } from './interfaces/PdfBuilder'
import { PdfDocumentArtifact } from './vo/PdfDocumentArtifact'
import { PdfDocumentStatus } from './vo/PdfDocumentStatus'
import { PdfDocumentGenerated } from './events/PdfDocumentGenerated'
import { PdfDocumentArtifactStore } from './repositories/PdfDocumentArtifactStore'

export class PdfDocument extends AggregateRoot<{
  template: Template
  data: PdfRawData
  status: PdfDocumentStatus
  failedReason?: string
  artifact?: PdfDocumentArtifact
}> {
  get status() {
    return this.props.status
  }
  get artifact() {
    return this.props.artifact
  }

  async build(
    renderer: TemplateEngine,
    pdfBuilder: PdfBuilder,
    pdfDocumentArtifactStore: PdfDocumentArtifactStore
  ): Promise<PdfDocumentArtifact> {
    try {
      this.props.status = PdfDocumentStatus.GENERATING
      const pdfArtifact = await pdfBuilder.build(
        this.props.template.render(
          this.props.data.toPrimitives().rawData,
          renderer
        )
      )
      await pdfDocumentArtifactStore.save(pdfArtifact)

      this.props.artifact = pdfArtifact
      this.props.status = PdfDocumentStatus.GENERATED
      this.recordEvent(PdfDocumentGenerated.fromAggregate(this))
      return pdfArtifact
    } catch (error) {
      this.props.status = PdfDocumentStatus.FAILED
      this.props.failedReason = (error as Error).message
      throw error
    }
  }

  static create(props: { template: Template; data: PdfRawData }): PdfDocument {
    return new PdfDocument({ ...props, status: PdfDocumentStatus.PENDING })
  }
}
