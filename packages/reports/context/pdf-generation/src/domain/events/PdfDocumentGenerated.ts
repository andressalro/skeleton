import { AggregateRoot, DomainEvent, EntityProps } from '@libs/core'

export class PdfDocumentGenerated extends DomainEvent {
  public readonly eventName = 'PDFDocument.Generated'

  static fromAggregate<T extends AggregateRoot<EntityProps>>(
    aggregate: T
  ): PdfDocumentGenerated {
    return new PdfDocumentGenerated({
      aggregateId: aggregate.id,
      payload: aggregate.toPrimitives(),
    })
  }
}
