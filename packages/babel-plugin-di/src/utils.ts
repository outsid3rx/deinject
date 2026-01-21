import type { NodePath } from '@babel/traverse'
import {
  Class,
  ClassMethod,
  Identifier,
  isClassMethod,
  isIdentifier,
  isTSParameterProperty,
  isTSTypeAnnotation,
  isTSTypeReference,
  TSParameterProperty,
  TSTypeAnnotation,
  TSTypeReference,
} from '@babel/types'

import type { CtorParam, DepsResult } from './types'

export function extractCtorParam(
  param: Identifier | TSParameterProperty,
): CtorParam {
  if (isIdentifier(param)) {
    return {
      name: param.name,
      type: (param.typeAnnotation as TSTypeAnnotation)?.typeAnnotation,
    }
  }

  if (isTSParameterProperty(param)) {
    const inner = param.parameter

    if (!isIdentifier(inner)) {
      throw new Error('Only identifier parameter properties are supported')
    }

    return {
      name: inner.name,
      type: (inner.typeAnnotation as TSTypeAnnotation)?.typeAnnotation,
    }
  }

  throw new Error('Unsupported constructor parameter')
}

export function extractDepsFromClass(path: NodePath<Class>) {
  const ctor = path.node.body.body.find(
    (m) => isClassMethod(m) && m.kind === 'constructor',
  )

  if (ctor) {
    return {
      deps: collectConstructorDeps(ctor as ClassMethod).map(
        ({ type }) => (type as TSTypeReference).typeName as Identifier,
      ),
    }
  }

  return extractConstructorDeps(path)
}

export function collectConstructorDeps(ctor: ClassMethod): CtorParam[] {
  return ctor.params.map((param) =>
    extractCtorParam(param as Identifier | TSParameterProperty),
  )
}

export function extractConstructorDeps(classPath: NodePath<Class>): DepsResult {
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
