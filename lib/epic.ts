import { Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators/mergeMap'
import { from } from 'rxjs/observable/from'
import { map } from 'rxjs/operators/map'
import { catchError } from 'rxjs/operators/catchError'
export { Observable } from 'rxjs/Observable'
export { ActionsObservable } from 'redux-observable'
import { of } from 'rxjs/observable/of'
import { ActionsObservable, combineEpics } from 'redux-observable'

import {
    IActionCreators,
    LOAD_LIST,
    ADD,
    UPDATE,
    REMOVE,
} from './actionCreators'
import { IActionTypes } from './createStoreListTypes'

export interface IApi {
    loadList?(params: any): Promise<any> | Observable<any>
    add?(payload: any): Promise<any> | Observable<any>
    update?(payload: any): Promise<any> | Observable<any>
    remove?(payload: any): Promise<any> | Observable<any>
}

export function createEpic<T>(
    {
        types,
        actionCreators,
    }: {
        types: IActionTypes
        actionCreators: IActionCreators<T>
    },
    api: IApi,
) {
    return combineEpics(loadListEpic, addEpic, updateEpic, removeEpic)

    function loadListEpic(
        action$: ActionsObservable<LOAD_LIST>,
        // store: any,
        // dependencies: any,
    ) {
        return action$.ofType(types.LOAD_LIST).pipe(
            mergeMap(action => {
                return from(api.loadList(action.payload)).pipe(
                    map(res => {
                        return actionCreators.loadListSuccess(res)
                    }),
                    catchError(error => {
                        return of(actionCreators.loadListFailure(error))
                    }),
                )
            }),
        )
    }

    function addEpic(
        action$: ActionsObservable<ADD>,
        // store: any,
        // dependencies: any,
    ) {
        return action$.ofType(types.ADD).pipe(
            mergeMap(action => {
                return from(api.add(action.payload)).pipe(
                    map(res => {
                        return actionCreators.addSuccess(action.payload, res)
                    }),
                    catchError(error => {
                        return of(
                            actionCreators.addFailure(error, action.payload),
                        )
                    }),
                )
            }),
        )
    }

    function updateEpic(
        action$: ActionsObservable<UPDATE>,
        // store: any,
        // dependencies: any,
    ) {
        return action$.ofType(types.UPDATE).pipe(
            mergeMap(action => {
                return from(api.update(action.payload)).pipe(
                    map(res => {
                        return actionCreators.updateSuccess(res)
                    }),
                    catchError(error => {
                        return of(
                            actionCreators.updateFailure(error, action.payload),
                        )
                    }),
                )
            }),
        )
    }

    function removeEpic(
        action$: ActionsObservable<REMOVE<T>>,
        // store: any,
        // dependencies: any,
    ) {
        return action$.ofType(types.REMOVE).pipe(
            mergeMap(action => {
                return from(api.remove(action.payload)).pipe(
                    map(res => {
                        return actionCreators.removeSuccess(res)
                    }),
                    catchError(error => {
                        return of(
                            actionCreators.removeFailure(error, action.payload),
                        )
                    }),
                )
            }),
        )
    }
}
