import { DomainEvent, EventPublisher } from '@libs/core'
import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge'

export class EventBridgeEventPublisher implements EventPublisher {
  constructor(
    private readonly client: EventBridgeClient,
    private readonly eventBusName: string,
    private readonly source: string,
    private readonly tenantId: string,
    private readonly traceId?: string
  ) {}

  async publish(event: DomainEvent[]): Promise<void> {
    const entries = event.map((e) => ({
      Source: this.source,
      DetailType: e.eventName,
      Detail: JSON.stringify({
        ...e.serialize(),
        context: { tenantId: this.tenantId, traceId: this.traceId },
      }),
      EventBusName: this.eventBusName,
    }))

    const command = new PutEventsCommand({ Entries: entries })
    await this.client.send(command).catch((error) => {
      console.error('Error publishing events to EventBridge:', error)
      //TODO: Handle the error to monitoring system but do not throw to avoid blocking main flow
    })
  }
}
