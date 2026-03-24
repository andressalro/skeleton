export abstract class ValueObject<TProps> {
  protected readonly props: TProps;

  constructor(props: TProps) {
    if (props === null || props === undefined) {
      throw new Error('ValueObject props cannot be null or undefined');
    }
    this.props = Object.freeze(props);
  }

  equals(other?: ValueObject<TProps>): boolean {
    if (!other) return false;
    return this.toString() === other.toString();
  }

  toPrimitives(): TProps {
    return { ...this.props };
  }

  toString(): string {
    return JSON.stringify(this.toPrimitives());
  }
}
