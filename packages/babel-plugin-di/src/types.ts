import { Identifier, TSType } from '@babel/types'

export interface DepsResult {
  deps: Identifier[]
}

export interface CtorParam {
  name: string
  type?: TSType
}
