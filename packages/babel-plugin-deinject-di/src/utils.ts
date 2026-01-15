import type { NodePath } from '@babel/traverse'
import {
  ClassDeclaration,
  Identifier,
  isIdentifier,
  isTSTypeAnnotation,
  isTSTypeReference,
} from '@babel/types'

import type { DepsResult } from './types'

export function extractConstructorDeps(
  classPath: NodePath<ClassDeclaration>,
): DepsResult {
  const deps: Identifier[] = []

  const body = classPath.get('body.body')

  for (const element of body) {
    if (element.isClassMethod() && element.node.kind === 'constructor') {
      for (const param of element.node.params) {
        if (!isIdentifier(param)) {
          throw element.buildCodeFrameError(
            'Only identifier constructor params are supported',
          )
        }

        if (
          !param.typeAnnotation ||
          !isTSTypeAnnotation(param.typeAnnotation)
        ) {
          throw element.buildCodeFrameError(
            'Constructor params must have type annotations',
          )
        }

        const type = param.typeAnnotation.typeAnnotation

        if (!isTSTypeReference(type)) {
          throw element.buildCodeFrameError(
            'Only class types are supported in DI',
          )
        }

        if (!isIdentifier(type.typeName)) {
          throw element.buildCodeFrameError('Qualified names are not supported')
        }

        deps.push(type.typeName)
      }
    }
  }

  return { deps }
}
