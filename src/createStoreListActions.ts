import { Action } from '@ngrx/store'

import { ILaravelPaginatedRes } from './../shared/laravel.interface'
import { IActionTypes } from './createStoreListTypes'

export interface LOAD_LIST extends Action {
  payload?: any
}
export interface LOAD_LIST_SUCCESS<T> extends Action {
  payload: ILaravelPaginatedRes<T>
}
export interface LOAD_LIST_FAILURE extends Action {
  error: Error
}
export interface LOAD_ITEM extends Action {
  payload?: any
}
export interface LOAD_ITEM_SUCCESS<T> extends Action {
  payload: T
}
export interface LOAD_ITEM_FAILURE extends Action {
  error: Error
}
export interface ADD extends Action {
  payload: any
}
export interface ADD_SUCCESS extends Action {
  payload: any
}
export interface ADD_FAILURE extends Action {
  payload: any
  error: Response
}
export interface UPDATE extends Action {
  payload: any
}
export interface UPDATE_SUCCESS extends Action {
  payload: any
}
export interface UPDATE_FAILURE extends Action {
  error: Response
  payload: any
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
  | LOAD_LIST
  | LOAD_LIST_SUCCESS<T>
  | LOAD_LIST_FAILURE
  | LOAD_ITEM
  | LOAD_ITEM_SUCCESS<T>
  | LOAD_ITEM_FAILURE
  | ADD
  | ADD_SUCCESS
  | ADD_FAILURE
  | UPDATE
  | UPDATE_SUCCESS
  | UPDATE_FAILURE
  | REMOVE
  | REMOVE_SUCCESS
  | REMOVE_FAILURE

export function createStoreListActionCreators<T>(types: IActionTypes) {
  return {
    loadList(params?: any): LOAD_LIST {
      return {
        type: types.LOAD_LIST,
        payload: params,
      }
    },
    loadListSuccess(payload): LOAD_LIST_SUCCESS<T> {
      return {
        type: types.LOAD_LIST_SUCCESS,
        payload,
      }
    },
    loadListFailure(error): LOAD_LIST_FAILURE {
      return {
        type: types.LOAD_LIST_FAILURE,
        error,
      }
    },

    loadItem(id): LOAD_ITEM {
      return {
        type: types.LOAD_ITEM,
        payload: {
          id,
        },
      }
    },
    loadItemSuccess(payload): LOAD_ITEM {
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

    add(payload: T): ADD {
      return {
        type: types.ADD,
        payload,
      }
    },
    addSuccess(response): ADD_SUCCESS {
      return {
        type: types.ADD_SUCCESS,
        payload: response,
      }
    },
    addFailure(error, payload): ADD_FAILURE {
      return {
        type: types.ADD_FAILURE,
        error,
        payload,
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
    updateFailure(error, payload): UPDATE_FAILURE {
      return {
        type: types.UPDATE_FAILURE,
        error,
        payload,
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
