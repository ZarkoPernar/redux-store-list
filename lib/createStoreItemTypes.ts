export interface IStoreItemActionTypes {
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

export function createStoreItemTypes(
    name: string,
    split = '/',
): IStoreItemActionTypes {
    return {
        LOAD_ITEM: name + split + 'LOAD_ITEM',
        LOAD_ITEM_SUCCESS: name + split + 'LOAD_ITEM_SUCCESS',
        LOAD_ITEM_FAILURE: name + split + 'LOAD_ITEM_FAILURE',
        UPDATE: name + split + 'UPDATE',
        UPDATE_SUCCESS: name + split + 'UPDATE_SUCCESS',
        UPDATE_FAILURE: name + split + 'UPDATE_FAILURE',
        REMOVE: name + split + 'REMOVE',
        REMOVE_SUCCESS: name + split + 'REMOVE_SUCCESS',
        REMOVE_FAILURE: name + split + 'REMOVE_FAILURE',
    }
}
