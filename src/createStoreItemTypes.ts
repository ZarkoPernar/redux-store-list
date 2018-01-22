interface t {
  LOAD_ITEM: string
  LOAD_ITEM_SUCCESS: string
  LOAD_ITEM_FAILURE: string
  UPDATE: string
  UPDATE_SUCCESS: string
  UPDATE_FAILURE: string
  REMOVE: string
  REMOVE_SUCCESS: string
  REMOVE_FAILURE: string
}

const TYPES = [
  'LOAD_ITEM',
  'LOAD_ITEM_SUCCESS',
  'LOAD_ITEM_FAILURE',
  'UPDATE',
  'UPDATE_SUCCESS',
  'UPDATE_FAILURE',
  'REMOVE',
  'REMOVE_SUCCESS',
  'REMOVE_FAILURE',
]

export interface IStoreItemActionTypes extends Partial<t> {}

export function createStoreItemTypes(name, split = '/'): IStoreItemActionTypes {
  return TYPES.reduce((types, type) => {
    return Object.assign(types, { [type]: name + split + type })
  }, {})
}
