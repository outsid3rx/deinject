import type { PluginObj } from '@babel/core'
import * as t from '@babel/types'

import { extractConstructorDeps } from './lib'

export { Container, globalContainer, Injectable, resolve } from './lib'

export default function diPlugin(): PluginObj {
  return {
    name: 'deinject-di',

    visitor: {
      ClassDeclaration(path) {
        const decorators = path.node.decorators
        if (!decorators || decorators.length === 0) return

        const injectableIndex = decorators.findIndex((d) => {
          return (
            t.isCallExpression(d.expression) &&
            t.isIdentifier(d.expression.callee, {
              name: 'Injectable',
            })
          )
        })

        if (injectableIndex === -1) return

        const classId = path.node.id
        if (!classId) {
          throw path.buildCodeFrameError('Injectable class must have a name')
        }

        const deps = extractConstructorDeps(path)

        path.node.decorators!.splice(injectableIndex, 1)
        if (path.node.decorators!.length === 0) {
          path.node.decorators = null
        }

        const depsAssign = t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(classId, t.identifier('__deps')),
            t.arrayExpression(deps.deps),
          ),
        )

        const injectableAssign = t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(classId, t.identifier('__injectable')),
            t.booleanLiteral(true),
          ),
        )

        path.insertAfter([depsAssign, injectableAssign])
      },
    },
  }
}
