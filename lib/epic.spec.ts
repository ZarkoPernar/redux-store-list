import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/throw'
import { of } from 'rxjs/observable/of'
import { createStore, applyMiddleware } from 'redux'

// import * as nock from 'nock'
import * as configureMockStore from 'redux-mock-store'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { createStoreList } from './createStoreList'

const entity = { id: 1, name: 'Test Item' }
const payload = { data: [entity] }
const api = {
    loadList: ({ withError } = { withError: false }) => {
        if (withError) {
            return Observable.throw(payload)
        }

        return of(payload)
    },
}
const storeList = createStoreList('test', { api })
const rootEpic = combineEpics(...storeList.epics)
const epicMiddleware = createEpicMiddleware(rootEpic)
const mockStore = configureMockStore([epicMiddleware])
const middleware = applyMiddleware(epicMiddleware)

describe('createEpic', () => {
    it('returns an erray of epics', () => {
        expect(storeList.epics).toBeInstanceOf(Array)
    })
})

describe('epic', () => {
    let store

    beforeEach(() => {
        store = mockStore()
    })

    afterEach(() => {
        epicMiddleware.replaceEpic(rootEpic)
    })

    it('produces the data on success', () => {
        store.dispatch(storeList.actionCreators.loadList())

        expect(store.getActions()).toEqual([
            storeList.actionCreators.loadList(),
            storeList.actionCreators.loadListSuccess(payload),
        ])
    })

    it('produces the error on failure', () => {
        store.dispatch(storeList.actionCreators.loadList({ withError: true }))

        expect(store.getActions()).toEqual([
            storeList.actionCreators.loadList({ withError: true }),
            storeList.actionCreators.loadListFailure(payload),
        ])
    })

    it('store data on success', () => {
        const store = createStore(storeList.reducer, undefined, middleware)
        store.dispatch(storeList.actionCreators.loadList())

        expect(store.getState()).toEqual({
            byId: {
                [entity.id]: entity,
            },
            allIds: [entity.id],
            isLoading: false,
            response: {
                data: [entity],
            },
        })
    })
})
