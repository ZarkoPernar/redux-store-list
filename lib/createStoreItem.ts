import { createStoreItemTypes } from './createStoreItemTypes'

import {
    LOAD_ITEM,
    LOAD_ITEM_SUCCESS,
    LOAD_ITEM_FAILURE,
    REMOVE,
    REMOVE_SUCCESS,
    REMOVE_FAILURE,
    UPDATE,
    UPDATE_SUCCESS,
    UPDATE_FAILURE,
    IActions,
    createStoreItemActionCreators,
} from './createStoreItemActions'
import { createStoreItemReducer } from './createStoreItemReducer'
import { IStoreItemActionTypes } from './createStoreItemTypes'
import { createStoreItemSelector } from './store.utils'

export interface IStoreItem<T> {
    entity: T
    isLoading?: boolean
    isUpdating?: boolean
    error?: Error
}

export function createStoreItem<T>(
    name: string,
    rootName: string,
    defaultState: any,
) {
    // const symbol = Symbol(name)
    const types = createStoreItemTypes(name)

    return {
        name,
        pageName: name,
        types,
        selector: createStoreItemSelector(name, rootName),
        reducer: createStoreItemReducer<T>(types, defaultState),
        actionCreators: createStoreItemActionCreators<T>(types),
    }
}
