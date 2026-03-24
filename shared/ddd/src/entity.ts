import { UniqueEntityId } from './unique-entity-id';

export abstract class Entity<TProps> {
  readonly id: UniqueEntityId;
  protected readonly props: TProps;

  protected constructor(props: TProps, id?: UniqueEntityId) {
    this.id = id ?? new UniqueEntityId();
    this.props = props;
  }

  equals(other?: Entity<TProps>): boolean {
    if (!other) return false;
    if (this === other) return true;
    if (this.constructor !== other.constructor) return false;
    return this.id.equals(other.id);
  }

  toPrimitives(): Record<string, unknown> & { id: string } {
    const primitive: Record<string, unknown> = {};
    for (const key in this.props) {
      primitive[key] = this.props[key];
    }
    return { id: this.id.toString(), ...primitive };
  }

  toString(): string {
    return JSON.stringify(this.toPrimitives());
  }
}
