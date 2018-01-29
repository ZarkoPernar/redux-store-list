import { createReducer } from './reducer'
import { createActionCreators } from './actionCreators'
import { createStoreListTypes } from './createStoreListTypes'
import { createTrackingFunction } from './store.utils'

const getEntityId = createTrackingFunction('_id')
const defaultState = {
    byId: {},
    allIds: [],
}
const types = createStoreListTypes('test')
const reducer = createReducer({ types, defaultState, getEntityId })
const actionCreators = createActionCreators(types)

// TEST DATA
const entity = {
    _id: 1,
    name: 'Test Name',
}

const action = actionCreators.add(entity)
let state = reducer(undefined, action)

describe('add', () => {
    it('produces correct state on add', () => {
        const action = actionCreators.add(entity)
        let state = reducer(undefined, action)

        expect(state).toEqual({
            byId: {
                1: entity,
            },
            allIds: [1],
            isUpdating: true,
        })
    })
})
