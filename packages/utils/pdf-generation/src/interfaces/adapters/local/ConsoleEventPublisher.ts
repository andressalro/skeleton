export class ConsoleEventPublisher {
  async publish(events: Array<{ serialize(): unknown }>): Promise<void> {
    if (events.length === 0) {
      return
    }

    console.log(
      'Local domain events:',
      JSON.stringify(
        events.map((event) => event.serialize()),
        null,
        2
      )
    )
  }
}
