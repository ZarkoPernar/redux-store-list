export interface IActionTypes {
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
    TRASH: string
    TRASH_SUCCESS: string
    TRASH_FAILURE: string
    RESTORE: string
    RESTORE_SUCCESS: string
    RESTORE_FAILURE: string
}

export function createStoreListTypes(name: string, split = '/'): IActionTypes {
    return {
        LOAD_LIST: name + split + 'LOAD_LIST',
        LOAD_LIST_SUCCESS: name + split + 'LOAD_LIST_SUCCESS',
        LOAD_LIST_FAILURE: name + split + 'LOAD_LIST_FAILURE',
        LOAD_ITEM: name + split + 'LOAD_ITEM',
        LOAD_ITEM_SUCCESS: name + split + 'LOAD_ITEM_SUCCESS',
        LOAD_ITEM_FAILURE: name + split + 'LOAD_ITEM_FAILURE',
        ADD: name + split + 'ADD',
        ADD_SUCCESS: name + split + 'ADD_SUCCESS',
        ADD_FAILURE: name + split + 'ADD_FAILURE',
        UPDATE: name + split + 'UPDATE',
        UPDATE_SUCCESS: name + split + 'UPDATE_SUCCESS',
        UPDATE_FAILURE: name + split + 'UPDATE_FAILURE',
        REMOVE: name + split + 'REMOVE',
        REMOVE_SUCCESS: name + split + 'REMOVE_SUCCESS',
        REMOVE_FAILURE: name + split + 'REMOVE_FAILURE',
        TRASH: name + split + 'TRASH',
        TRASH_SUCCESS: name + split + 'TRASH_SUCCESS',
        TRASH_FAILURE: name + split + 'TRASH_FAILURE',
        RESTORE: name + split + 'RESTORE',
        RESTORE_SUCCESS: name + split + 'RESTORE_SUCCESS',
        RESTORE_FAILURE: name + split + 'RESTORE_FAILURE',
    }
}
