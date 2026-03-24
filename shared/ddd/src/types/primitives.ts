export type Primitive = string | number | boolean | null | undefined

export type WithId<T> = {
  [K in keyof T]: T[K]
} & { id: string }
