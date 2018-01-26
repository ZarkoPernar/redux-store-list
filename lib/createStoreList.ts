import { createSelector } from 'reselect'

import { createStoreListTypes, IActionTypes } from './createStoreListTypes'

import { createStoreListSelector } from './store.utils'
import { createStoreListPageReducer } from './createStoreListPageReducer'

import { createCombinedReducer } from './createCombinedReducer'
import { createStoreItem } from './createStoreItem'
import { fromStoreList } from './store.utils'
import { createEpic } from './epic'
import { createActionCreators } from './actionCreators'

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
    api?: any
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
    const defaultState = options.pages
        ? createDefaultStateWithPages(options.pages)
        : defaultRootState

    const types = createStoreListTypes(name)
    const actionCreators = createActionCreators<T>(types)
    const selector = createStoreListSelector(name, options.rootName)

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
        epics: createEpic<T>(types, actionCreators, options.api),
        reducer: options.pages
            ? reducer
            : createStoreListPageReducer('default', types, {
                  hasPages: false,
                  defaultState,
              }),
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

    const actionCreators = createActionCreators<T>(types)

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
        epics: createEpic<T>(types, actionCreators, options.api),
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
