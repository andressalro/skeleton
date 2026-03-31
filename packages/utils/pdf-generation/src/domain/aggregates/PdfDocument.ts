import { AggregateRoot } from '@libs/core'
import { ReceiptTemplate } from '../entities/ReceiptTemplate'
import { PdfRawData } from '../vo/PdfRawData'
import { PdfDocumentArtifact } from '../vo/PdfDocumentArtifact'
import { PdfDocumentStatus } from '../vo/PdfDocumentStatus'
import { PdfDocumentGenerated } from '../events/PdfDocumentGenerated'

export class PdfDocument extends AggregateRoot<{
  template: ReceiptTemplate
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

  get template() {
    return this.props.template
  }

  get data() {
    return this.props.data
  }

  startGeneration(): void {
    this.props.status = PdfDocumentStatus.GENERATING
    this.props.failedReason = undefined
  }

  static create(props: {
    template: ReceiptTemplate
    data: PdfRawData
  }): PdfDocument {
    return new PdfDocument({ ...props, status: PdfDocumentStatus.PENDING })
  }

  completeGeneration(artifact: PdfDocumentArtifact): void {
    this.props.artifact = artifact
    this.props.failedReason = undefined
    this.props.status = PdfDocumentStatus.GENERATED
    this.recordEvent(PdfDocumentGenerated.fromAggregate(this))
  }

  failGeneration(reason: string): void {
    this.props.status = PdfDocumentStatus.FAILED
    this.props.failedReason = reason
  }
}
