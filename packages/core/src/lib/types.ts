import { Container } from './container'

export type Class<T = any> = new (...args: any[]) => T

export type Token<T = any> = Class<T>

export interface FactoryProvider<T = any> {
  useFactory(container: Container): T
}

export type Provider<T = any> = Class<T> | FactoryProvider<T> | T

export interface InjectableMeta {
  __deps?: Token[]
  __injectable?: true
}
