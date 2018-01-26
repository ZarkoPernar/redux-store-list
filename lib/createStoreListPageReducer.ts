import {
    IActions,
    LOAD_LIST_FAILURE,
    LOAD_LIST_SUCCESS,
    LOAD_ITEM_SUCCESS,
    LOAD_ITEM_FAILURE,
    ADD,
    ADD_SUCCESS,
    ADD_FAILURE,
    UPDATE,
    UPDATE_SUCCESS,
    UPDATE_FAILURE,
    TRASH,
    TRASH_SUCCESS,
    TRASH_FAILURE,
    RESTORE,
    RESTORE_SUCCESS,
    RESTORE_FAILURE,
} from './actionCreators'
import { IActionTypes } from './createStoreListTypes'
import { toStoreList, toStoreListMerge } from './store.utils'
import { IOptions, IRootStoreList, IStoreList } from './createStoreList'

export function createStoreListPageReducer<T>(
    pageName: string,
    types: IActionTypes,
    { hasPages, defaultState }: { hasPages: boolean; defaultState: any },
) {
    const getState = hasPages ? getPageState : getFlatState
    const combineStateAndPage = hasPages ? assignPageState : assignFlatState

    return function reducer(state = defaultState, anyAction: IActions<T>) {
        let action

        switch (anyAction.type) {
            // LOAD_LIST
            case types.LOAD_LIST:
                return combineStateAndPage(state, {
                    isLoading: true,
                })

            case types.LOAD_LIST_SUCCESS:
                action = anyAction as LOAD_LIST_SUCCESS<T>
                return loadListSuccess(state, action)

            case types.LOAD_LIST_FAILURE:
                action = anyAction as LOAD_LIST_FAILURE
                return combineStateAndPage(state, {
                    isLoading: false,
                    error: {
                        status: action.error.status,
                        message: action.error.message,
                    },
                })

            // LOAD_ITEM
            case types.LOAD_ITEM:
                return combineStateAndPage(state, {
                    isUpdating: true,
                })

            case types.LOAD_ITEM_SUCCESS:
                action = anyAction as LOAD_ITEM_SUCCESS<T>

                if (action.payload === null) return state

                return combineStateAndPage(
                    {
                        ...state,
                        byId: {
                            ...state.byId,
                            [action.payload.id]: action.payload,
                        },
                    },
                    {
                        isUpdating: false,
                    },
                )

            case types.LOAD_ITEM_FAILURE:
                action = anyAction as LOAD_ITEM_FAILURE
                return combineStateAndPage(state, {
                    isUpdating: false,
                })

            // ADD
            case types.ADD:
                action = anyAction as ADD
                return add(state, action)

            case types.ADD_SUCCESS:
                action = anyAction as ADD_SUCCESS
                return handleAddSuccess(state, action.payload)

            case types.ADD_FAILURE:
                return handleAddFail(state, anyAction as ADD_FAILURE)

            // UPDATE
            case types.UPDATE:
                action = anyAction as UPDATE
                return combineStateAndPage(update(state, action.payload), {
                    isUpdating: true,
                })

            case types.UPDATE_SUCCESS:
                action = anyAction as UPDATE_SUCCESS
                return combineStateAndPage(update(state, action.payload), {
                    isUpdating: false,
                })

            case types.UPDATE_FAILURE:
                action = anyAction as UPDATE_FAILURE
                return combineStateAndPage(state, {
                    isUpdating: false,
                    error: {
                        status: action.error.status,
                        message: action.error.message,
                    },
                })

            // REMOVE
            // TODO:

            // TRASH
            case types.TRASH:
                action = anyAction as TRASH
                return combineStateAndPage(state, { isUpdating: true })

            case types.TRASH_SUCCESS:
                action = anyAction as TRASH_SUCCESS
                return combineStateAndPage(state, { isUpdating: false })

            case types.TRASH_FAILURE:
                action = anyAction as TRASH_FAILURE
                return combineStateAndPage(state, {
                    isUpdating: false,
                    error: {
                        status: action.error.status,
                        message: action.error.message,
                    },
                })

            // RESTORE
            case types.RESTORE:
                action = anyAction as RESTORE
                return combineStateAndPage(state, { isUpdating: true })

            case types.RESTORE_SUCCESS:
                action = anyAction as RESTORE_SUCCESS
                return combineStateAndPage(state, { isUpdating: false })

            case types.RESTORE_FAILURE:
                action = anyAction as RESTORE_FAILURE
                return combineStateAndPage(state, {
                    isUpdating: false,
                    error: {
                        status: action.error.status,
                        message: action.error.message,
                    },
                })

            default:
                return state
        }
    }

    function loadListSuccess(state, action: LOAD_LIST_SUCCESS<T>) {
        return combineStateAndPage(
            {
                ...state,
                byId: toStoreListMerge(action.payload.data, state).byId,
            },
            {
                isLoading: false,
                response: action.payload,
                allIds: toStoreList(action.payload.data).allIds,
            },
        )
    }

    function add(state, { payload }) {
        return combineStateAndPage(
            {
                ...state,
                byId: {
                    ...state.byId,
                    [payload.id]: payload,
                },
            },
            {
                isUpdating: true,
                allIds: [...getState(state).allIds, payload.id],
            },
        )
    }

    function update(state, payload, meta?: any) {
        return {
            ...state,
            byId: {
                ...state.byId,
                [payload.id]: {
                    ...state.byId[payload.id],
                    ...payload,
                },
            },
            ...meta,
        }
    }

    function remove(state, action) {
        const nextState = {
            ...state,
            byId: {
                ...state.byId,
            },
        }

        delete nextState.byId[action.payload.id]

        return combineStateAndPage(nextState, {
            allIds: getState(nextState).allIds.filter(
                id => id !== action.payload.id,
            ),
        })
    }

    function handleAddFail(state, action: ADD_FAILURE) {
        const error = action.error

        if (action.error.status === 0) {
            return combineStateAndPage(state, {
                isUpdating: false,
                error: {
                    status: action.error.status,
                    // message: action.error.message,
                },
            })
        }

        return remove(state, action)
    }

    function handleAddSuccess(state, { response, originalPayload }) {
        const allIds = [...getState(state).allIds]
        const nextState = {
            ...state,
            byId: {
                ...state.byId,
                [response.id]: response,
            },
        }
        // delete entity with offline id
        delete nextState.byId[originalPayload.id]

        allIds.splice(
            getState(nextState).allIds.indexOf(originalPayload.id),
            1,
            response.id,
        )

        return combineStateAndPage(nextState, {
            isUpdating: false,
            allIds,
        })
    }

    function getFlatState(state) {
        return state
    }

    function getPageState(state) {
        return state.pages[pageName]
    }

    function assignFlatState(state, owerwrite: any) {
        return {
            ...state,
            ...owerwrite,
        }
    }

    function assignPageState(state, page: any) {
        return {
            ...state,
            pages: {
                ...state.pages,
                [pageName]: {
                    ...state.pages[pageName],
                    ...page,
                },
            },
        }
    }
}
