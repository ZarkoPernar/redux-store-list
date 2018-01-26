import { createStoreList } from './createStoreList'

let storeList
const INIT = '@@INIT'

describe('createStoreList', () => {
    beforeEach(() => {
        storeList = createStoreList('projects', {
            pages: [
                'projectList',
                {
                    name: 'projectDetails',
                    type: 'single',
                },
            ],
        })
    })

    it('storeList should be correct default state', () => {
        const defaultState = storeList.reducer(undefined, { type: INIT })

        expect(defaultState).toEqual({
            byId: {},
            pages: {
                projectList: {
                    allIds: [],
                },
                projectDetails: {
                    entity: null,
                },
            },
        })
    })

    it('correct defaultState without pages', () => {
        const list = createStoreList('projects')
        const defaultState = list.reducer(undefined, { type: INIT })

        expect(defaultState).toEqual({
            byId: {},
            allIds: [],
        })
    })

    it('correct state with actions without pages', () => {
        const list = createStoreList('projects')
        const payload = {
            data: [{ id: 1, name: 'Yo!' }],
        }
        let state = list.reducer(undefined, { type: INIT })
        state = list.reducer(
            state,
            list.actionCreators.loadListSuccess(payload),
        )

        expect(state).toEqual({
            byId: {
                1: {
                    id: 1,
                    name: 'Yo!',
                },
            },
            allIds: [1],
            isLoading: false,
            response: payload,
        })
    })
})
