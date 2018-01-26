const config = require('./rollup.config.cjs.js')
const { nameLibrary, PATH_DIST } = require('./config-library.js')

config.output.format = 'es'
config.output.file = PATH_DIST + nameLibrary + '.esm.js'

module.exports = config
