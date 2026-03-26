export interface EventSubscriber<T> {
  on(event: T): void
}
