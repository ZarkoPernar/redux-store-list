import { createSelector } from 'reselect'
import {
    LOAD_LIST,
    LOAD_LIST_SUCCESS,
    LOAD_LIST_FAILURE,
    LOAD_ITEM,
    LOAD_ITEM_SUCCESS,
    LOAD_ITEM_FAILURE,
    ADD,
    ADD_SUCCESS,
    ADD_FAILURE,
    UPDATE,
    UPDATE_SUCCESS,
    UPDATE_FAILURE,
    TRASH,
    TRASH_SUCCESS,
    TRASH_FAILURE,
    RESTORE,
    RESTORE_SUCCESS,
    RESTORE_FAILURE,
    REMOVE,
    REMOVE_SUCCESS,
    REMOVE_FAILURE,
} from './createStoreListActions'
import { createStoreListTypes, IActionTypes } from './createStoreListTypes'
import {
    IActions,
    createStoreListActionCreators,
} from './createStoreListActions'
import { createStoreListReducer } from './createStoreListReducer'

import { createStoreListSelector } from './store.utils'
import { createStoreListPageReducer } from './createStoreListPageReducer'

import { createCombinedReducer } from './createCombinedReducer'
import { createStoreItem } from './createStoreItem'
import { fromStoreList } from './store.utils'

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

export type IPageType = 'single' | 'list'

export type IPageOption =
    | string
    | {
          name: string
          type: IPageType
      }

export interface IOptions {
    rootName?: string
    rootList?: any
    pages?: IPageOption[]
}

export interface IStoreListPages<T> {
    [pageName: string]: IStoreListPage<T>
}
export interface IStoreListPage<T> {
    pageName: string
    types: IActionTypes
    actionCreators: any
    reducer: Function
    selector: Function
}

const defaultRootState = { byId: {} }

export default function createStoreList<T>(
    name: string,
    options: IOptions = {},
) {
    // const symbol = Symbol(name)
    const defaultState = options.pages
        ? createDefaultStateWithPages(options.pages)
        : defaultRootState

    const types = createStoreListTypes(name)
    const actionCreators = createStoreListActionCreators<T>(types)
    const selector = createStoreListSelector(name, options.rootName)

    const pages: IStoreListPages<T> = options.pages
        ? options.pages.reduce((acc, pageOption) => {
              const pageName = getPageName(pageOption)
              const pageType = getPageType(pageOption)

              return {
                  ...acc,
                  [pageName]:
                      pageType === 'list'
                          ? createStoreListPage<T>(
                                pageOption,
                                name,
                                defaultState,
                                options,
                            )
                          : createStoreItem(pageName, name, defaultState),
              }
          }, {})
        : {}

    const pageReducers = Object.values(pages)

    const reducer = createCombinedReducer(defaultState, pageReducers)

    return {
        name,
        types,
        selector,
        reducer,
        actionCreators,
        pages,
    }
}

export function createStoreListPage<T>(
    pageOption: IPageOption,
    rootName: string,
    defaultState: any,
    options: IOptions,
) {
    const pageName = getPageName(pageOption)
    const pageType = getPageType(pageOption)

    const types = createStoreListTypes(rootName + ' > ' + pageName)

    const actionCreators = createStoreListActionCreators<T>(types)

    const reducer = createStoreListPageReducer(pageName, types, {
        defaultState,
        hasPages: Boolean(options.pages),
    })

    const selector = createSelector(
        (state: any) => state[rootName].byId,
        (state: any) => state[rootName].pages[pageName].allIds,
        (byId, allIds) => {
            return fromStoreList({ byId, allIds })
        },
    )

    return {
        pageName,
        types,
        actionCreators,
        reducer,
        selector,
    }
}

export function createDefaultStateWithPages(
    pagesOption: Array<string | IPageOption> = [],
) {
    const pages: {
        [pageName: string]: {
            allIds: Array<string | number>
        }
    } = {
        ...pagesOption.reduce((acc, pageOption) => {
            const pageName = getPageName(pageOption)
            const pageType = getPageType(pageOption)
            return Object.assign(acc, {
                [pageName]:
                    pageType === 'list'
                        ? {
                              allIds: [],
                          }
                        : { entity: null },
            })
        }, {}),
    }

    return {
        byId: {},
        pages: {
            ...pages,
        },
    }
}

function getPageName(pageOption: IPageOption | string) {
    return typeof pageOption === 'string' ? pageOption : pageOption.name
}

function getPageType(pageOption: IPageOption | string): IPageType {
    return typeof pageOption === 'string' ? 'list' : pageOption.type
}
