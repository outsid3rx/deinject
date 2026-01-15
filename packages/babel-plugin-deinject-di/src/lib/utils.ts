import type { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

import { globalContainer } from './container'
import type { DepsResult, Token } from './types'

export function resolve<T>(token: Token<T>): T {
  return globalContainer.resolve(token)
}

export function register<T>(token: Token<T>, provider?: any): void {
  globalContainer.register(token, provider)
}

export function inject(...deps: Token[]) {
  return function <T extends Function>(target: T): void {
    const ctor = target as T & { __deps?: Token[] }
    ctor.__deps = deps
  }
}

export function extractConstructorDeps(
  classPath: NodePath<t.ClassDeclaration>,
): DepsResult {
  const deps: t.Identifier[] = []

  const body = classPath.get('body.body')

  for (const element of body) {
    if (element.isClassMethod() && element.node.kind === 'constructor') {
      for (const param of element.node.params) {
        if (!t.isIdentifier(param)) {
          throw element.buildCodeFrameError(
            'Only identifier constructor params are supported',
          )
        }

        if (
          !param.typeAnnotation ||
          !t.isTSTypeAnnotation(param.typeAnnotation)
        ) {
          throw element.buildCodeFrameError(
            'Constructor params must have type annotations',
          )
        }

        const type = param.typeAnnotation.typeAnnotation

        if (!t.isTSTypeReference(type)) {
          throw element.buildCodeFrameError(
            'Only class types are supported in DI',
          )
        }

        if (!t.isIdentifier(type.typeName)) {
          throw element.buildCodeFrameError('Qualified names are not supported')
        }

        deps.push(type.typeName)
      }
    }
  }

  return { deps }
}
