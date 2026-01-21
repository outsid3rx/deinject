import type { PluginObj } from '@babel/core'
import {
  arrayExpression,
  assignmentExpression,
  booleanLiteral,
  expressionStatement,
  identifier,
  isCallExpression,
  isIdentifier,
  memberExpression,
} from '@babel/types'

import { extractDepsFromClass } from './utils'

export default function diPlugin(): PluginObj {
  return {
    name: 'deinject-di',

    visitor: {
      Class(path) {
        const decorators = path.node.decorators
        if (!decorators || decorators.length === 0) return

        const injectableIndex = decorators.findIndex((d) => {
          return (
            isCallExpression(d.expression) &&
            isIdentifier(d.expression.callee, {
              name: 'Injectable',
            })
          )
        })

        if (injectableIndex === -1) return

        const classId = path.node.id
        if (!classId) {
          throw path.buildCodeFrameError('Injectable class must have a name')
        }

        const deps = extractDepsFromClass(path)

        path.node.decorators!.splice(injectableIndex, 1)
        if (path.node.decorators!.length === 0) {
          path.node.decorators = null
        }

        const depsAssign = expressionStatement(
          assignmentExpression(
            '=',
            memberExpression(classId, identifier('__deps')),
            arrayExpression(deps.deps),
          ),
        )

        const injectableAssign = expressionStatement(
          assignmentExpression(
            '=',
            memberExpression(classId, identifier('__injectable')),
            booleanLiteral(true),
          ),
        )

        path.insertAfter([depsAssign, injectableAssign])
      },
    },
  }
}
