import { Action } from '@ngrx/store'

import { IStoreItemActionTypes } from './createStoreItemTypes'

export interface LOAD_ITEM extends Action {
  payload?: any
}
export interface LOAD_ITEM_SUCCESS<T> extends Action {
  payload: T
}
export interface LOAD_ITEM_FAILURE extends Action {
  error: Error
}
export interface UPDATE extends Action {
  payload: any
}
export interface UPDATE_SUCCESS extends Action {
  payload: any
}
export interface UPDATE_FAILURE extends Action {
  error: Error
}
export interface REMOVE extends Action {
  payload: any
}
export interface REMOVE_SUCCESS extends Action {
  payload: any
}
export interface REMOVE_FAILURE extends Action {
  error: Error
}

export type IActions<T> =
  | LOAD_ITEM
  | LOAD_ITEM_SUCCESS<T>
  | LOAD_ITEM_FAILURE
  | UPDATE
  | UPDATE_SUCCESS
  | UPDATE_FAILURE
  | REMOVE
  | REMOVE_SUCCESS
  | REMOVE_FAILURE

export function createStoreItemActionCreators<T>(types: IStoreItemActionTypes) {
  return {
    loadItem(id: number | string): LOAD_ITEM {
      return {
        type: types.LOAD_ITEM,
        payload: { id },
      }
    },
    loadItemSuccess(payload): LOAD_ITEM_SUCCESS<T> {
      return {
        type: types.LOAD_ITEM_SUCCESS,
        payload,
      }
    },
    loadItemFailure(error): LOAD_ITEM_FAILURE {
      return {
        type: types.LOAD_ITEM_FAILURE,
        error,
      }
    },

    update(payload: T): UPDATE {
      return {
        type: types.UPDATE,
        payload,
      }
    },
    updateSuccess(response): UPDATE_SUCCESS {
      return {
        type: types.UPDATE_SUCCESS,
        payload: response,
      }
    },
    updateFailure(error): UPDATE_FAILURE {
      return {
        type: types.UPDATE_FAILURE,
        error,
      }
    },

    remove(payload: T): REMOVE {
      return {
        type: types.REMOVE,
        payload,
      }
    },
    removeSuccess(response): REMOVE_SUCCESS {
      return {
        type: types.REMOVE_SUCCESS,
        payload: response,
      }
    },
    removeFailure(error): REMOVE_FAILURE {
      return {
        type: types.REMOVE_FAILURE,
        error,
      }
    },
  }
}
