import { createSelector } from 'reselect'

export function createStoreListSelector(
    storeName: string,
    rootStoreName?: string,
) {
    if (rootStoreName === undefined) {
        return createSelector(
            state => state[storeName],
            state => fromStoreList(state),
        )
    }

    return createSelector(
        state => state[rootStoreName],
        state => state[storeName],
        // combine
        (rootState, state) => {
            const byId = rootState.byId
            const allIds = state.allIds

            return fromStoreList({
                allIds,
                byId,
            })
        },
    )
}
export function createStoreItemSelector(
    storeName: string,
    rootStoreName?: string,
) {
    if (rootStoreName === undefined) {
        return createSelector(
            state => state[storeName].entity,
            state => state.entity,
        )
    }

    return createSelector(
        state => state[rootStoreName].byId,
        state => state[storeName],
        // combine
        (byId, state) => {
            if (!state.entity) return state.entity

            return byId[state.entity.id]
        },
    )
}
export function createToIds(getEntityId: Function) {
    return function toIds(item: any) {
        return getEntityId(item)
    }
}
export function createToHash(getEntityId: Function) {
    return function toHash(hash: any, item: any) {
        hash[getEntityId(item)] = item
        return hash
    }
}
export function toHash(hash, item) {
    hash[item.id] = item
    return hash
}

function toIds(item) {
    return item.id
}

function toItems(id) {
    return this[id]
}

export function toStoreListMerge(
    array = [],
    state: any,
    getEntityId: Function,
) {
    const allIds = Array.isArray(state.allIds) ? [...state.allIds] : []
    const byId = state.byId !== undefined ? { ...state.byId } : {}

    for (let index = 0; index < array.length; index++) {
        let element = array[index]

        if (byId[getEntityId(element)] === undefined) {
            allIds.push(getEntityId(element))
        }

        byId[getEntityId(element)] = element
    }

    return { allIds, byId }
}

export function toStoreList(arr = [], getEntityId: Function) {
    return {
        allIds: arr.map(
            getEntityId === undefined ? toIds : createToIds(getEntityId),
        ),
        byId: arr.reduce(
            getEntityId === undefined ? toHash : createToHash(getEntityId),
            {},
        ),
    }
}

export function fromStoreList({
    allIds,
    byId,
}: {
    allIds?: number[]
    byId?: any
}) {
    const ids = allIds || []
    const items = byId || {}
    return ids.map(toItems, items)
}

export function createTrackingFunction(propName: string) {
    return function getEntityId(entity: any) {
        return entity[propName]
    }
}
