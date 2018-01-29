module.exports = function(wallaby) {
    return {
        files: ['lib/**/*.ts'],

        tests: ['lib/**/*.spec.ts'],
        testFramework: 'jest',
        compilers: {
            '**/*.ts': wallaby.compilers.typeScript({
                // TypeScript compiler specific options
                // https://github.com/Microsoft/TypeScript/wiki/Compiler-Options
                // (no need to duplicate tsconfig.json, if you have it, it'll be automatically used)
            }),
        },
        setup: function(wallaby) {
            const jestConfig = require('./package.json').jest

            wallaby.testFramework.configure(jestConfig)
        },
    }
}
