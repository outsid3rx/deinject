import { globalContainer } from './container'
import type { Token } from './types'

export function Injectable(deps: Token[] = []) {
  return function <T extends new (...args: any[]) => any>(
    value: T,
    context: ClassDecoratorContext,
  ): void {
    if (context.kind !== 'class') return

    const target = value as T & {
      __deps?: Token[]
      __injectable?: true
    }

    target.__deps = deps
    target.__injectable = true

    // 🔥 auto-registration
    globalContainer.register(target)
  }
}
