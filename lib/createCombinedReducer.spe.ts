import {
    createStoreListPage,
    createDefaultStateWithPages,
} from './createStoreList'

const INIT = '@@INIT'
const rootName = 'projects'
const firstPageName = 'projectList'
const secondPageName = 'projectDetails'
const pages = [firstPageName, { name: secondPageName, type: 'single' }]
let defaultState

describe('createStoreListPageReducer', () => {
    beforeEach(() => {
        defaultState = createDefaultStateWithPages({ pages } as any)
    })

    it('two page reducers executed in sequence return correct default state', () => {
        const rootName = 'projects'
        const page1 = createStoreListPage(
            firstPageName,
            rootName,
            defaultState,
            {
                pages,
            },
        )
        const page2 = createStoreListPage(
            secondPageName,
            rootName,
            defaultState,
            {
                pages,
            },
        )

        let state
        // to get the initial state we pass undefined
        state = page1.reducer(state, { type: INIT })
        state = page2.reducer(state, { type: INIT })

        expect(state).toEqual({
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

    it('two page reducers do not interfere with eachother', () => {
        const firstPage = createStoreListPage(
            firstPageName,
            rootName,
            defaultState,
            {
                pages,
            },
        )
        const secondPage = createStoreListPage(
            secondPageName,
            rootName,
            defaultState,
            {
                pages,
            },
        )

        const dataItem = { id: 1, name: 'Hello 1' }
        const response = {
            data: [dataItem],
        }

        const ACTION1 = {
            type: firstPage.types.LOAD_LIST_SUCCESS,
            payload: {
                data: [dataItem],
            },
        }
        const ACTION2 = {
            type: secondPage.types.LOAD_ITEM,
            payload: dataItem,
        }

        let state
        // to get the initial state we pass undefined
        state = firstPage.reducer(state, ACTION1)
        state = secondPage.reducer(state, ACTION1)

        state = firstPage.reducer(state, ACTION2)
        state = secondPage.reducer(state, ACTION2)

        expect(state).toEqual({
            byId: {
                [dataItem.id]: dataItem,
            },
            pages: {
                [firstPageName]: {
                    allIds: [dataItem.id],
                    isLoading: false,
                    response,
                },
                projectDetails: {
                    entity: null,
                    isUpdating: true,
                },
            },
        })
    })
})
