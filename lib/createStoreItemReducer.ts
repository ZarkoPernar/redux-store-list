import {
    IActions,
    LOAD_ITEM_SUCCESS,
    LOAD_ITEM_FAILURE,
    UPDATE,
    UPDATE_SUCCESS,
    UPDATE_FAILURE,
} from './createStoreItemActions'
import { IStoreItemActionTypes } from './createStoreItemTypes'

export function createStoreItemReducer<T>(
    types: IStoreItemActionTypes,
    defaultState: any,
) {
    return function reducer(state = defaultState, anyAction: IActions<T>) {
        let action
        let prevState

        switch (anyAction.type) {
            // LOAD_ITEM
            case types.LOAD_ITEM:
                return {
                    ...state,
                    isLoading: true,
                }

            case types.LOAD_ITEM_SUCCESS:
                action = anyAction as LOAD_ITEM_SUCCESS<T>
                return {
                    ...state,
                    isLoading: false,
                    entity: action.payload,
                }

            case types.LOAD_ITEM_FAILURE:
                action = anyAction as LOAD_ITEM_FAILURE
                return {
                    ...state,
                    isLoading: false,
                    error: {
                        status: action.error.status,
                        message: action.error.message,
                    },
                }

            // UPDATE
            case types.UPDATE:
                action = anyAction as UPDATE
                return {
                    ...state,
                    isUpdating: true,
                    entity: {
                        ...state.entity,
                        ...action.payload,
                    },
                }

            case types.UPDATE_SUCCESS:
                action = anyAction as UPDATE_SUCCESS
                return {
                    ...state,
                    isUpdating: false,
                    entity: {
                        ...state.entity,
                        ...action.payload,
                    },
                }

            case types.UPDATE_FAILURE:
                action = anyAction as UPDATE_FAILURE
                return {
                    ...state,
                    isUpdating: false,
                    error: action.error,
                }

            // REMOVE
            // TODO:

            default:
                return state
        }
    }
}
