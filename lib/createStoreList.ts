import { createSelector } from 'reselect'

import { createStoreListTypes, IActionTypes } from './createStoreListTypes'

import { createStoreListSelector, createTrackingFunction } from './store.utils'
import { createReducer } from './reducer'

import { createCombinedReducer } from './createCombinedReducer'
import { createStoreItem } from './createStoreItem'
import { fromStoreList } from './store.utils'
import { createEpic } from './epic'
import { createActionCreators } from './actionCreators'

const DEFAULT_ID_PROP_NAME = 'id'

export interface IRootStoreList<T> {
    byId: {
        [id: number]: T
    }
}
export interface IStoreListPartial {
    allIds: Array<number | string>
    isLoading?: boolean
    error?: Error
}

export interface IStoreList<T> extends IRootStoreList<T>, IStoreListPartial {}

export type IPageType = 'single' | 'list'

export type IPageOption =
    | string
    | {
          name: string
          type: IPageType
      }

export type ITrackingFunction = (entity: any) => string | number

export interface IOptions {
    pages?: IPageOption[]
    api?: any
    getEntityId?: ITrackingFunction | string
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

const defaultRootState = { byId: {}, allIds: [] }

export function createStoreList<T>(name: string, options: IOptions = {}) {
    // const symbol = Symbol(name)
    let getEntityId: ITrackingFunction
    if (options.getEntityId) {
        getEntityId =
            typeof options.getEntityId === 'function'
                ? options.getEntityId
                : createTrackingFunction(options.getEntityId)
    } else {
        getEntityId = createTrackingFunction(DEFAULT_ID_PROP_NAME)
    }

    const defaultState = options.pages
        ? createDefaultStateWithPages(options.pages)
        : defaultRootState

    const types = createStoreListTypes(name)
    const actionCreators = createActionCreators<T>(types)
    const selector = createStoreListSelector(name)

    const pages: IStoreListPages<T> = options.pages
        ? options.pages.reduce((acc, page) => {
              const pageName = getPageName(page)
              const pageType = getPageType(page)

              return {
                  ...acc,
                  [pageName]:
                      pageType === 'list'
                          ? createStoreListPage<T>(
                                page,
                                name,
                                defaultState,
                                getEntityId,
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
        epic: createEpic<T>(types, actionCreators, options.api),
        reducer: options.pages
            ? reducer
            : createReducer({
                  types,
                  defaultState,
                  getEntityId,
              }),
        actionCreators,
        pages,
    }
}

export function createStoreListPage<T>(
    pageOption: IPageOption,
    rootName: string,
    defaultState: any,
    getEntityId: ITrackingFunction,
    options: IOptions = {},
) {
    const pageName = getPageName(pageOption)
    const pageType = getPageType(pageOption)

    const types = createStoreListTypes(rootName + ' > ' + pageName)

    const actionCreators = createActionCreators<T>(types)

    const reducer = createReducer({
        pageName,
        types,
        defaultState,
        getEntityId,
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
        epic: createEpic<T>(types, actionCreators, options.api),
    }
}

// export interface IDefaultStateWithPages<T> {
//     byId: {
//         [id: string | number]: T
//     }
//     pages: {
//         [pageName: string]: {
//             allIds: string[] | number[]
//         }
//     }
// }
export function createDefaultStateWithPages(
    pagesOption: Array<string | IPageOption> = [], //: IDefaultStateWithPages<T>
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
