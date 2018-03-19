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
    REMOVE,
} from '../actionCreators'
import { IActionTypes } from '../createStoreListTypes'
import { toStoreList, toStoreListMerge } from '../store.utils'
import { IOptions, IRootStoreList, IStoreList } from '../createStoreList'

export interface ICreateReducerOptions {
    pageName?: string
    types: IActionTypes
    defaultState: any
    getEntityId(entity: any): string | number
}

export function createReducer<T>({
    pageName,
    types,
    defaultState,
    getEntityId,
}: ICreateReducerOptions) {
    const getState = pageName ? getPageState : getFlatState
    const combineStateAndPage = pageName ? assignPageState : assignFlatState

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
                            [getEntityId(action.payload)]: action.payload,
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
                return handleAdd(state, anyAction as ADD)

            case types.ADD_SUCCESS:
                return handleAddSuccess(state, anyAction as ADD_SUCCESS)

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
            // case types.REMOVE:
            //     action = anyAction as REMOVE<T>
            //     return handleRemove(state, action)

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
                byId: toStoreListMerge(action.payload.data, state, getEntityId)
                    .byId,
            },
            {
                isLoading: false,
                response: action.payload,
                allIds:
                    action.meta !== undefined && action.meta.merge === true
                        ? toStoreListMerge(
                              action.payload.data,
                              state,
                              getEntityId,
                          ).allIds
                        : toStoreList(action.payload.data, getEntityId).allIds,
            },
        )
    }

    function handleAdd(state, { payload }: ADD) {
        let itemsToAdd = payload

        if (!Array.isArray(itemsToAdd)) {
            // Always handle add payload as an array
            itemsToAdd = [payload]
        }

        const nextState = toStoreList(itemsToAdd, getEntityId)

        return combineStateAndPage(
            {
                ...state,
                byId: {
                    ...state.byId,
                    ...nextState.byId,
                },
            },
            {
                isUpdating: true,
                allIds: [...getState(state).allIds, ...nextState.allIds],
            },
        )
    }

    // TODO: handle adding multiple items
    function handleAddSuccess(state, { payload }: ADD_SUCCESS) {
        const { response, originalPayload } = payload
        const originalId = getEntityId(originalPayload)
        const newId = getEntityId(response)

        const allIds = [...getState(state).allIds]
        const nextState = {
            ...state,
            byId: {
                ...state.byId,
                [newId]: {
                    ...state.byId[newId],
                    ...response,
                },
            },
        }
        // delete entity with offline id
        delete nextState.byId[originalId]

        allIds.splice(getState(nextState).allIds.indexOf(originalId), 1, newId)

        return combineStateAndPage(nextState, {
            isUpdating: false,
            allIds,
        })
    }
    // TODO: handle adding multiple items
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

    function update(state, payload, meta?: any) {
        return {
            ...state,
            byId: {
                ...state.byId,
                [getEntityId(payload)]: {
                    ...state.byId[getEntityId(payload)],
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

        delete nextState.byId[getEntityId(action.payload)]

        return combineStateAndPage(nextState, {
            allIds: getState(nextState).allIds.filter(
                id => id !== getEntityId(action.payload),
            ),
        })
    }

    // function handleRemove(state: IStoreList<T>, { payload }: REMOVE<T>) {
    //     if (Array.isArray(payload)) {
    //         const nextState = {
    //             ...state,
    //             allIds: state.allIds.filter(
    //                 (id) => !payload.includes(id),
    //             ),
    //             byId: { ...state.byId },
    //         }
    //         payload.forEach((item: T) => {
    //             const id = getEntityId(item)
    //             nextState.pages[pageName].allIds.splice(nextState.pages[pageName].allIds.indexOf(id), 1)
    //             delete nextState.byId[id]
    //         })
    //         combineStateAndPage(nextState, {
    //             isUpdating: false,
    //             allIds,
    //         })
    //         return nextState
    //     }

    //     const nextState = {
    //         ...state,
    //         allIds: [...state.allIds],
    //         byId: { ...state.byId },
    //     }
    //     nextState.pages[pageName].allIds.splice(nextState.pages[pageName].allIds.indexOf(getEntityId(payload)), 1)
    //     delete nextState.byId[getEntityId(payload)]
    //     return nextState
    // }

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
