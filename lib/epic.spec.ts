import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/throw'
import { of } from 'rxjs/observable/of'
import { createStore, applyMiddleware } from 'redux'

// import * as nock from 'nock'
import * as configureMockStore from 'redux-mock-store'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { createStoreList } from './createStoreList'

const entity = { _id: 1, name: 'Test Item' }
const addResponse = { _id: 2, name: 'Test Item' }
const addError = { status: 412, message: 'Validation error' }
const payload = { data: [entity] }
const api = {
    loadList: ({ withError } = { withError: false }) => {
        if (withError) {
            return Observable.throw(payload)
        }

        return of(payload)
    },

    add: ({ withError }) => {
        if (withError) {
            return Observable.throw(addError)
        }

        return of(addResponse)
    },
}
const storeList = createStoreList('test', { api, getEntityId: '_id' })
const epicMiddleware = createEpicMiddleware(storeList.epic)
const mockStore = configureMockStore([epicMiddleware])
const middleware = applyMiddleware(epicMiddleware)

describe('createEpic', () => {
    it('epic is a function', () => {
        expect(storeList.epic).toBeInstanceOf(Function)
    })
})

describe('epic', () => {
    let store

    beforeEach(() => {
        store = mockStore()
    })

    afterEach(() => {
        epicMiddleware.replaceEpic(storeList.epic)
    })

    it('produces the data on loadList success', () => {
        store.dispatch(storeList.actionCreators.loadList())

        expect(store.getActions()).toEqual([
            storeList.actionCreators.loadList(),
            storeList.actionCreators.loadListSuccess(payload),
        ])
    })

    it('produces the error on loadList failure', () => {
        store.dispatch(storeList.actionCreators.loadList({ withError: true }))

        expect(store.getActions()).toEqual([
            storeList.actionCreators.loadList({ withError: true }),
            storeList.actionCreators.loadListFailure(payload),
        ])
    })

    it('produces the data on add success', () => {
        store.dispatch(storeList.actionCreators.add(entity))

        expect(store.getActions()).toEqual([
            storeList.actionCreators.add(entity),
            storeList.actionCreators.addSuccess(entity, addResponse),
        ])
    })

    it('produces the error on add failure', () => {
        store.dispatch(
            storeList.actionCreators.add({ ...entity, withError: true }),
        )

        expect(store.getActions()).toEqual([
            storeList.actionCreators.add({ ...entity, withError: true }),
            storeList.actionCreators.addFailure(addError, {
                ...entity,
                withError: true,
            }),
        ])
    })

    it('produces correct store data on loadList success', () => {
        const store = createStore(storeList.reducer, undefined, middleware)
        store.dispatch(storeList.actionCreators.loadList())

        expect(store.getState()).toEqual({
            byId: {
                [entity._id]: entity,
            },
            allIds: [entity._id],
            isLoading: false,
            response: {
                data: [entity],
            },
        })
    })

    it('produces correct store data on add success', () => {
        const store = createStore(storeList.reducer, undefined, middleware)
        store.dispatch(storeList.actionCreators.add(entity))

        expect(store.getState()).toEqual({
            byId: {
                [addResponse._id]: {
                    ...entity,
                    ...addResponse,
                },
            },
            isUpdating: false,
            allIds: [addResponse._id],
        })
    })
})
