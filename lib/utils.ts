export interface IStoreNormalized {
    allIds: Array<string | number>
    byId: {
        [id: number]: any
    }
}

export function splitDataStructure(data: any[]): IStoreNormalized {
    return data.reduce(splitDataItem, {
        allIds: [],
        byId: {}
    })
}

export function splitDataItem(obj, item) {
    obj.byId[item.id] = item
    obj.ids.push(item.id)
    return obj
}

export function updateAndReplace(arr: any[], item: any) {
    if (!arr) return arr
    let index = arr.findIndex(tmp => tmp.id === item.id || tmp.id === item.offlineId)
    if (~index) {
        arr[index] = Object.assign({}, item)
        return [
            ...arr.slice(0, index),
            Object.assign({}, arr[index], item),
            ...arr.slice(index + 1)
        ]
    } else {
        return arr
    }
}

export function updateOrAdd(arr: any[], item: any) {
    if (!arr) {
        arr = []
    }

    let index = arr.findIndex(tmp => tmp.id === item.id || tmp.id === item.offlineId)
    if (~index) {
        arr[index] = Object.assign({}, item)
        return [
            ...arr.slice(0, index),
            Object.assign({}, arr[index], item),
            ...arr.slice(index + 1)
        ]
    } else {
        return [...arr, item]
    }
}

export function removeLog(arr: any[], item) {
    if (!arr) return arr

    return arr.filter(tmp => tmp.id !== item.id)
}
