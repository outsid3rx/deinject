import { globalContainer } from './container'
import type { Token } from './types'

export function resolve<T>(token: Token<T>): T {
  return globalContainer.resolve(token)
}

export function register<T>(token: Token<T>, provider?: any): void {
  globalContainer.register(token, provider)
}
