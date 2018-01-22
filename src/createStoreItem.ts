import { createStoreItemTypes } from './createStoreItemTypes'
import {
  IActions,
  createStoreItemActionCreators,
} from './createStoreItemActions'
import { createStoreItemReducer } from './createStoreItemReducer'

import { createStoreItemSelector } from './store.utils'

export interface IStoreItem<T> {
  entity: T
  isLoading?: boolean
  isUpdating?: boolean
  error?: Error
}

export interface IOptions {
  rootName?: string
  rootItem?: any
}

export function createStoreItem<T>(name: string, options: IOptions = {}) {
  // const symbol = Symbol(name)
  const types = createStoreItemTypes(name)

  return {
    name,
    types,
    selector: createStoreItemSelector(name, options.rootName),
    reducer: createStoreItemReducer<T>(types, options),
    actionCreators: createStoreItemActionCreators<T>(types),
  }
}
