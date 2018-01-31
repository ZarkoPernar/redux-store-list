# Redux Store List

Set of utilities for quickly creating lists of entities, along with reducers, types, and action creators

## Installation

```
npm i redux-store-list
```

## Get Started

```javascript
// example.js
import { createStoreList } from 'redux-store-list'

export const exampleList = createStoreList('example')

// appStore.js
import { createStore } from 'redux'
import { exampleList } from './example.js'

const store = createStore(combineReducers({
    example: exampleList.reducer,
}))

store.dispatch(exampleList.actionCreators.loadList())
// { byId: {}, allIds: [], loading: true }

const response = await fetch('/api/list').then(res => res.json()) // { data: [{id: 1, name: 'Example Entity 1'}] }
store.dispatch(exampleList.actionCreators.loadListSuccess(response))
// {
//    byId: {
//        1: {
//            id: 1,
//            name: 'Example Entity 1',
//        }
//    },
//    loading: false,
//    allIds: [1]
// }
```

## With Epic

```javascript
// example.js
import { createStoreList } from 'redux-store-list'

export const exampleList = createStoreList('example', {
    api: {
        loadList() {
            const res = await fetch('/api/list').then(res => res.json())
            // { data: [{id: 1, name: 'Example Entity 1'}] }
            return res
        }
    }
})

// appStore.js
import { createStore, applyMiddleware } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { exampleList } from './example.js'

const epics = combineEpics(
    exampleList.epic,
    // ...other epics
)
const epicMiddleware = createEpicMiddleware(epics)
const reducers = combineReducers({
    example: exampleList.reducer,
})
const middleware = applyMiddleware(epicMiddleware)
const store = createStore(reducers, {}, middleware)

store.dispatch(exampleList.actionCreators.loadList())
// { byId: {}, allIds: [], loading: true }

// Some time later
// {
//    byId: {
//        1: {
//            id: 1,
//            name: 'Example Entity 1',
//        }
//    },
//    loading: false,
//    allIds: [1]
// }
```

## Options

```javascript
    createStoreList('name', {
        getEntityId: '_id' || (entity) => entity.some_id_field,
        api: {
            loadList: (params) => api.getlist(params),
            add: (data) => api.add(data),
            update: (data) => api.update(data),
            remove: (data) => api.remove(data),
        },
        pages: [
            'somePageListName',
            {
                type: 'single' || 'list',
                name: 'someOtherPageName',
            }
        ]
    })
```
