import { IActions } from './createStoreListActions'
import { IStoreListPage } from './createStoreList'

export function createCombinedReducer<T>(
    rootState: any,
    pages: IStoreListPage<T>[] = [],
) {
    return function combinedReducer(state = rootState, action: IActions<T>) {
        return pages.reduce((acc, page) => {
            return page.reducer(acc, action)
        }, state)
    }
}
