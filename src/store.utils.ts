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
    state => state[rootStoreName],
    state => state[storeName],
    // combine
    (rootState, state) => {
      if (!state.entity) return state.entity

      const byId = rootState.byId

      return byId[state.entity.id]
    },
  )
}
function createToIds(idPropName: string) {
  return function toIds(item) {
    return item[idPropName]
  }
}
export function createToHash(idPropName: string) {
  return function toHash(hash, item) {
    hash[item[idPropName]] = item
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

export function toStoreListMerge(array = [], state, idPropName: string = 'id') {
  const allIds = Array.isArray(state.allIds) ? [...state.allIds] : []
  const byId = state.byId !== undefined ? { ...state.byId } : {}

  for (let index = 0; index < array.length; index++) {
    let element = array[index]

    if (byId[element[idPropName]] === undefined) {
      allIds.push(element[idPropName])
    }

    byId[element[idPropName]] = element
  }

  return { allIds, byId }
}

export function toStoreList(arr = [], idPropName?: string) {
  return {
    allIds: arr.map(idPropName === undefined ? toIds : createToIds(idPropName)),
    byId: arr.reduce(
      idPropName === undefined ? toHash : createToHash(idPropName),
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
