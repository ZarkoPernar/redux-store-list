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
} from './createStoreListActions'
import { IActionTypes } from './createStoreListTypes'
import { toStoreList, toStoreListMerge } from './store.utils'
import {
  IOptions,
  IStateType,
  IRootStoreList,
  IStoreList,
} from './createStoreList'

const rootState = {
  allIds: {},
}

const defaultState = {
  allIds: {},
}

const getDefaultState = stateType => {
  switch (stateType) {
    case 'root':
      return {
        byId: {},
      }
    case 'partial':
      return {
        allIds: [],
      }
    default:
      return {
        allIds: [],
        byId: {},
      }
  }
}

export function createStoreListReducer<T>(
  types: IActionTypes,
  { stateType }: IOptions,
) {
  return function reducer(
    state = getDefaultState(stateType),
    anyAction: IActions<T>,
  ) {
    let action
    let prevState

    switch (anyAction.type) {
      // LOAD_LIST
      case types.LOAD_LIST:
        return {
          ...state,
          isLoading: true,
        }

      case types.LOAD_LIST_SUCCESS:
        action = anyAction as LOAD_LIST_SUCCESS<T>
        return loadListSuccess(state, action)

      case types.LOAD_LIST_FAILURE:
        action = anyAction as LOAD_LIST_FAILURE
        return {
          ...state,
          isLoading: false,
          error: action.error,
        }

      // LOAD_ITEM
      case types.LOAD_ITEM:
        return {
          ...state,
          isUpdating: true,
        }

      case types.LOAD_ITEM_SUCCESS:
        action = anyAction as LOAD_ITEM_SUCCESS<T>
        prevState = state as IRootStoreList<T> | IStoreList<T>
        return {
          ...state,
          isUpdating: false,
          byId: {
            ...prevState.byId,
            [action.payload.id]: action.payload,
          },
        }

      case types.LOAD_ITEM_FAILURE:
        action = anyAction as LOAD_ITEM_FAILURE
        return {
          ...state,
          isUpdating: false,
          // error: action.error,
        }

      // ADD
      case types.ADD:
        action = anyAction as ADD
        return add(state, action)

      case types.ADD_SUCCESS:
        action = anyAction as ADD_SUCCESS
        return update(state, action, { isUpdating: false })

      case types.ADD_FAILURE:
        return handleAddFail(state, anyAction as ADD_FAILURE)

      // UPDATE
      case types.UPDATE:
        action = anyAction as UPDATE
        return update(state, action, { isUpdating: true })

      case types.UPDATE_SUCCESS:
        action = anyAction as UPDATE_SUCCESS
        return update(state, action, { isUpdating: false })

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

  function loadListSuccess(state, action: LOAD_LIST_SUCCESS<T>) {
    if (stateType === undefined) {
      return {
        ...state,
        isLoading: false,
        response: action.payload,
        ...toStoreList(action.payload.data),
      }
    }

    if (stateType === 'root') {
      return {
        ...state,
        isLoading: false,
        byId: toStoreListMerge(action.payload.data, state).byId,
      }
    }

    return {
      ...state,
      isLoading: false,
      response: action.payload,
      allIds: toStoreList(action.payload.data).allIds,
    }
  }

  function add(state, { payload }) {
    if (stateType === undefined) {
      return {
        ...state,
        isUpdating: true,
        allIds: [...state.allIds, payload.id],
        byId: {
          ...state.byId,
          [payload.id]: payload,
        },
      }
    }

    if (stateType === 'root') {
      return {
        ...state,
        isUpdating: true,
        byId: {
          ...state.byId,
          [payload.id]: payload,
        },
      }
    }

    return {
      ...state,
      isUpdating: true,
      allIds: [...state.allIds, payload.id],
    }
  }

  function update(state, { payload }, meta?: any) {
    if (stateType !== 'partial') {
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

    return state
  }

  function remove(state, action) {
    if (stateType === undefined) {
      const nextState = {
        ...state,
        allIds: state.allIds.filter(id => id !== action.payload.id),
        byId: {
          ...state.byId,
          [action.payload.id]: action.payload,
        },
      }

      delete nextState.byId[action.payload.id]

      return nextState
    }

    if (stateType === 'root') {
      const nextState = {
        ...state,
        byId: {
          ...state.byId,
        },
      }

      delete nextState.byId[action.payload.id]

      return nextState
    }

    // is partial
    return {
      ...state,
      allIds: state.allIds.filter(id => id !== action.payload.id),
    }
  }

  function handleAddFail(state, action: ADD_FAILURE) {
    const error = action.error

    if (action.error.status === 0) {
      return {
        ...state,
        isUpdating: false,
        error: action.error,
      }
    }

    return remove(state, action)
  }
}
