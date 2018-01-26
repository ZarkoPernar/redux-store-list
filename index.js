var createStoreList = require('./dist/createStoreList')

module.exports = {
    createStoreList: createStoreList.default
        ? createStoreList.default
        : createStoreList,
}
