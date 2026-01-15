import type { Class, FactoryProvider, Provider, Token } from './types'

export class Container {
  private readonly providers = new Map<Token, Provider>()
  private readonly singletons = new Map<Token, any>()
  private readonly resolving = new Set<Token>()

  register<T>(token: Token<T>, provider: Provider<T> = token): void {
    this.providers.set(token, provider)
  }

  resolve<T>(token: Token<T>): T {
    if (this.singletons.has(token)) {
      return this.singletons.get(token)
    }

    if (this.resolving.has(token)) {
      throw new Error(
        `Circular dependency detected for token: ${String(token)}`,
      )
    }

    const provider = this.providers.get(token)
    if (!provider) {
      throw new Error(`No provider registered for token: ${String(token)}`)
    }

    this.resolving.add(token)

    let instance: T

    // class provider
    if (typeof provider === 'function') {
      const ctor = provider as Class<T> & { __deps?: Token[] }
      const deps = ctor.__deps ?? []
      const args = deps.map((dep) => this.resolve(dep))
      instance = new ctor(...args)
    }

    // factory provider
    else if (this.isFactoryProvider(provider)) {
      instance = provider.useFactory(this)
    }

    // value provider
    else {
      instance = provider as T
    }

    this.resolving.delete(token)
    this.singletons.set(token, instance)

    return instance
  }

  private isFactoryProvider(provider: Provider): provider is FactoryProvider {
    return (
      typeof provider === 'object' &&
      provider !== null &&
      'useFactory' in provider
    )
  }
}

export const globalContainer = new Container()
