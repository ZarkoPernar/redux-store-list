import { IActionTypes } from './createStoreListTypes'

export interface Action {
    type: string
}

export interface LOAD_LIST extends Action {
    payload?: any
}
export interface LOAD_LIST_SUCCESS<T> extends Action {
    payload: T
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
    error: {
        status: number
        message?: string
    }
}
export interface UPDATE extends Action {
    payload: any
}
export interface UPDATE_SUCCESS extends Action {
    payload: any
}
export interface UPDATE_FAILURE extends Action {
    error: any
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
    payload: any
}

export interface TRASH extends Action {
    payload: any
}
export interface TRASH_SUCCESS extends Action {
    payload: any
}
export interface TRASH_FAILURE extends Action {
    error: Error
    payload: any
}

export interface RESTORE extends Action {
    payload: any
}
export interface RESTORE_SUCCESS extends Action {
    payload: any
}
export interface RESTORE_FAILURE extends Action {
    error: Error
    payload: any
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
    | TRASH
    | TRASH_SUCCESS
    | TRASH_FAILURE
    | RESTORE
    | RESTORE_SUCCESS
    | RESTORE_FAILURE

export interface IActionCreators<T> {
    loadList(params?: any): LOAD_LIST
    loadListSuccess(payload: any): LOAD_LIST_SUCCESS<T>
    loadListFailure(error: any): LOAD_LIST_FAILURE
    loadItem(id: string | number): LOAD_ITEM
    loadItemSuccess(payload: any): LOAD_ITEM
    loadItemFailure(error: any): LOAD_ITEM_FAILURE
    add(payload: T): ADD
    addSuccess(originalPayload: any, response: any): ADD_SUCCESS
    addFailure(error: any, payload: any): ADD_FAILURE
    update(payload: T): UPDATE
    updateSuccess(response: any): UPDATE_SUCCESS
    updateFailure(error: any, payload: any): UPDATE_FAILURE
    remove(payload: T): REMOVE
    removeSuccess(response: any): REMOVE_SUCCESS
    removeFailure(error: any, payload: any): REMOVE_FAILURE
    trash(payload: T): TRASH
    trashSuccess(response: any): TRASH_SUCCESS
    trashFailure(error: any, payload: any): TRASH_FAILURE
    restore(payload: T): RESTORE
    restoreSuccess(response: any): RESTORE_SUCCESS
    restoreFailure(error: any, payload: any): RESTORE_FAILURE
}
export function createActionCreators<T>(
    types: IActionTypes,
): IActionCreators<T> {
    return {
        loadList(params?: any): LOAD_LIST {
            return {
                type: types.LOAD_LIST,
                payload: params,
            }
        },
        loadListSuccess(payload: any): LOAD_LIST_SUCCESS<T> {
            return {
                type: types.LOAD_LIST_SUCCESS,
                payload,
            }
        },
        loadListFailure(error: any): LOAD_LIST_FAILURE {
            return {
                type: types.LOAD_LIST_FAILURE,
                error,
            }
        },

        loadItem(id: string | number): LOAD_ITEM {
            return {
                type: types.LOAD_ITEM,
                payload: {
                    id,
                },
            }
        },
        loadItemSuccess(payload: any): LOAD_ITEM {
            return {
                type: types.LOAD_ITEM_SUCCESS,
                payload,
            }
        },
        loadItemFailure(error: any): LOAD_ITEM_FAILURE {
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
        addSuccess(originalPayload: any, response: any): ADD_SUCCESS {
            return {
                type: types.ADD_SUCCESS,
                payload: {
                    response,
                    originalPayload,
                },
            }
        },
        addFailure(error: any, payload: any): ADD_FAILURE {
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
        updateSuccess(response: any): UPDATE_SUCCESS {
            return {
                type: types.UPDATE_SUCCESS,
                payload: response,
            }
        },
        updateFailure(error: any, payload: any): UPDATE_FAILURE {
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
        removeSuccess(response: any): REMOVE_SUCCESS {
            return {
                type: types.REMOVE_SUCCESS,
                payload: response,
            }
        },
        removeFailure(error: any, payload: any): REMOVE_FAILURE {
            return {
                type: types.REMOVE_FAILURE,
                error,
                payload,
            }
        },

        trash(payload: T): TRASH {
            return {
                type: types.TRASH,
                payload,
            }
        },
        trashSuccess(response: any): TRASH_SUCCESS {
            return {
                type: types.TRASH_SUCCESS,
                payload: response,
            }
        },
        trashFailure(error: any, payload: any): TRASH_FAILURE {
            return {
                type: types.TRASH_FAILURE,
                error,
                payload,
            }
        },

        restore(payload: T): RESTORE {
            return {
                type: types.RESTORE,
                payload,
            }
        },
        restoreSuccess(response: any): RESTORE_SUCCESS {
            return {
                type: types.RESTORE_SUCCESS,
                payload: response,
            }
        },
        restoreFailure(error: any, payload: any): RESTORE_FAILURE {
            return {
                type: types.RESTORE_FAILURE,
                error,
                payload,
            }
        },
    }
}
