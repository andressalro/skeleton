import { ValueObject } from '../value-object/value-object'

export type Primitive = string | number | boolean | null | undefined

export type WithId<T> = {
  [K in keyof T]: T[K]
} & { id: string }

export type InferPrimitives<T> = {
  [K in keyof T]: T[K] extends ValueObject<infer V>
    ? V
    : T[K] extends undefined | ValueObject<infer V>
      ? V | undefined
      : T[K] extends Date
        ? string
        : T[K]
}
