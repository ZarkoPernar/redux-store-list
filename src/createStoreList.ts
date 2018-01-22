import { createStoreListTypes } from './createStoreListTypes'
import {
  IActions,
  createStoreListActionCreators,
} from './createStoreListActions'
import { createStoreListReducer } from './createStoreListReducer'

import { createStoreListSelector } from './store.utils'

export interface IRootStoreList<T> {
  byId: {
    [id: number]: T
  }
}
export interface IStoreList<T> extends IRootStoreList<T> {
  allIds: number[]
  isLoading?: boolean
  error?: Error
}
export interface IStoreListPartial {
  allIds: number[]
  isLoading?: boolean
  error?: Error
}

export type IStateType = 'root' | 'partial'
export interface IOptions {
  stateType?: IStateType
  rootName?: string
  rootList?: any
}

export function createStoreList<T>(name: string, options: IOptions) {
  // const symbol = Symbol(name)
  const types = createStoreListTypes(name)

  return {
    name,
    types,
    selector: createStoreListSelector(name, options.rootName),
    reducer: createStoreListReducer<T>(types, options),
    actionCreators: createStoreListActionCreators<T>(types),
  }
}
