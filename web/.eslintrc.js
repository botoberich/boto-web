module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        // 'prettier',
        // 'eslint:recommended',
        // 'plugin:@typescript-eslint/eslint-recommended',
        // 'plugin:@typescript-eslint/recommended',
        // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
        // 'plugin:prettier/recommended',
        // 'prettier/@typescript-eslint',
        // 'plugin:@typescript-eslint/recommended',
        // 'airbnb',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        // "@typescript-eslint/rule-name": "error"
    },
};
