"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reselect_1 = require("reselect");
function createStoreListSelector(storeName, rootStoreName) {
    if (rootStoreName === undefined) {
        return reselect_1.createSelector(state => state[storeName], state => fromStoreList(state));
    }
    return reselect_1.createSelector(state => state[rootStoreName], state => state[storeName], 
    // combine
    (rootState, state) => {
        const byId = rootState.byId;
        const allIds = state.allIds;
        return fromStoreList({
            allIds,
            byId,
        });
    });
}
exports.createStoreListSelector = createStoreListSelector;
function createStoreItemSelector(storeName, rootStoreName) {
    if (rootStoreName === undefined) {
        return reselect_1.createSelector(state => state[storeName].entity, state => state.entity);
    }
    return reselect_1.createSelector(state => state[rootStoreName], state => state[storeName], 
    // combine
    (rootState, state) => {
        if (!state.entity)
            return state.entity;
        const byId = rootState.byId;
        return byId[state.entity.id];
    });
}
exports.createStoreItemSelector = createStoreItemSelector;
function createToIds(idPropName) {
    return function toIds(item) {
        return item[idPropName];
    };
}
function createToHash(idPropName) {
    return function toHash(hash, item) {
        hash[item[idPropName]] = item;
        return hash;
    };
}
exports.createToHash = createToHash;
function toHash(hash, item) {
    hash[item.id] = item;
    return hash;
}
exports.toHash = toHash;
function toIds(item) {
    return item.id;
}
function toItems(id) {
    return this[id];
}
function toStoreListMerge(array = [], state, idPropName = 'id') {
    const allIds = Array.isArray(state.allIds) ? [...state.allIds] : [];
    const byId = state.byId !== undefined ? Object.assign({}, state.byId) : {};
    for (let index = 0; index < array.length; index++) {
        let element = array[index];
        if (byId[element[idPropName]] === undefined) {
            allIds.push(element[idPropName]);
        }
        byId[element[idPropName]] = element;
    }
    return { allIds, byId };
}
exports.toStoreListMerge = toStoreListMerge;
function toStoreList(arr = [], idPropName) {
    return {
        allIds: arr.map(idPropName === undefined ? toIds : createToIds(idPropName)),
        byId: arr.reduce(idPropName === undefined ? toHash : createToHash(idPropName), {}),
    };
}
exports.toStoreList = toStoreList;
function fromStoreList({ allIds, byId, }) {
    const ids = allIds || [];
    const items = byId || {};
    return ids.map(toItems, items);
}
exports.fromStoreList = fromStoreList;
