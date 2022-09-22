export const routes = {
  Main: "",
} as const

type R = typeof routes

type ValueOf<T> = T[keyof T]

export type Route = ValueOf<R>
