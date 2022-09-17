export const routes = {
  Baccarat: "baccarat",
} as const

type R = typeof routes

type ValueOf<T> = T[keyof T]

export type Route = ValueOf<R>
