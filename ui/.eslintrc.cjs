/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: [
        'next/core-web-vitals',
        'plugin:import/recommended',
        'plugin:import/typescript',
    ],
    'parserOptions': {
        'sourceType': 'module',
    },
    'settings': {
        'import/resolver': {
            'typescript': true,
        },
    },
    'rules': {
        'import/order': [
            'warn',
            {
                'alphabetize': {
                    'order': 'asc',
                    'caseInsensitive': true,
                },
                'distinctGroup': true,
                'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
                'newlines-between': 'always',
            },
        ],
    },
};
