import { createReducer } from './index'
import { createActionCreators } from '../actionCreators'
import { createStoreListTypes } from '../createStoreListTypes'
import { createTrackingFunction } from '../store.utils'

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
const entitys = [
    {
        _id: 1,
        name: 'Test Name',
    },
    {
        _id: 2,
        name: 'Test Again',
    },
]

const action = actionCreators.add(entity)
let state = reducer(undefined, action)

describe('loadList', () => {
    it('merges state on loadListSuccess with meta.replace', () => {
        const action = actionCreators.loadListSuccess(
            { data: entitys },
            {
                merge: true,
            },
        )
        let state = reducer(
            {
                byId: {
                    '123': {
                        _id: '123',
                        name: 'Offline Item',
                    },
                },
                allIds: ['123'],
                isUpdating: true,
            },
            action,
        )

        expect(state).toEqual({
            byId: {
                '123': {
                    _id: '123',
                    name: 'Offline Item',
                },
                1: { _id: 1, name: 'Test Name' },
                2: { _id: 2, name: 'Test Again' },
            },
            allIds: ['123', 1, 2],
            isLoading: false,
            isUpdating: true,
            response: {
                data: [
                    {
                        _id: 1,
                        name: 'Test Name',
                    },
                    {
                        _id: 2,
                        name: 'Test Again',
                    },
                ],
            },
        })
    })
})

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

// describe('remove', () => {
//     it('produces correct state on remove single item', () => {
//         const action = actionCreators.remove(entity)
//         let state = reducer(
//             {
//                 byId: {
//                     1: entity,
//                 },
//                 allIds: [1],
//                 isUpdating: false,
//             },
//             action,
//         )

//         expect(state).toEqual({
//             byId: {},
//             allIds: [],
//             isUpdating: true,
//         })
//     })

// it('produces correct state on remove multiple items', () => {
//     const action = actionCreators.remove(entity)
//     let state = reducer(undefined, action)

//     expect(state).toEqual({
//         byId: {
//             1: entity,
//         },
//         allIds: [1],
//         isUpdating: true,
//     })
// })
// })
