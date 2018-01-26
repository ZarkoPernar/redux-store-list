import createStoreList from './createStoreList'

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
})
