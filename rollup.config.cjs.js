const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const typescript = require('rollup-plugin-typescript')

const { nameLibrary, PATH_SRC, PATH_DIST } = require('./config-library.js')

module.exports = {
    input: PATH_SRC + nameLibrary + '.ts',
    output: {
        name: nameLibrary,
        sourcemap: true,
        format: 'cjs',
        file: PATH_DIST + nameLibrary + '.cjs.js',
    },
    external: ['reselect'],
    plugins: [
        typescript({
            typescript: require('typescript'),
        }),
        resolve({
            module: true,
            main: true,
        }),
        commonjs({
            include: 'node_modules/**',
        }),
    ],
    onwarn: warning => {
        const skip_codes = ['THIS_IS_UNDEFINED', 'MISSING_GLOBAL_NAME']
        if (skip_codes.indexOf(warning.code) != -1) return
        console.error(warning)
    },
}
