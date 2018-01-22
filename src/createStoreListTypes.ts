interface t {
  LOAD_LIST: string
  LOAD_LIST_SUCCESS: string
  LOAD_LIST_FAILURE: string
  LOAD_ITEM: string
  LOAD_ITEM_SUCCESS: string
  LOAD_ITEM_FAILURE: string
  ADD: string
  ADD_SUCCESS: string
  ADD_FAILURE: string
  UPDATE: string
  UPDATE_SUCCESS: string
  UPDATE_FAILURE: string
  REMOVE: string
  REMOVE_SUCCESS: string
  REMOVE_FAILURE: string
}

const TYPES = [
  'LOAD_LIST',
  'LOAD_LIST_SUCCESS',
  'LOAD_LIST_FAILURE',
  'LOAD_ITEM',
  'LOAD_ITEM_SUCCESS',
  'LOAD_ITEM_FAILURE',
  'ADD',
  'ADD_SUCCESS',
  'ADD_FAILURE',
  'UPDATE',
  'UPDATE_SUCCESS',
  'UPDATE_FAILURE',
  'REMOVE',
  'REMOVE_SUCCESS',
  'REMOVE_FAILURE',
]

export interface IActionTypes extends Partial<t> {}

export function createStoreListTypes(name, split = '/'): IActionTypes {
  return TYPES.reduce((types, type) => {
    return Object.assign(types, { [type]: name + split + type })
  }, {})
}
