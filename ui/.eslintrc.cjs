/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: [
        '@remix-run/eslint-config',
        '@remix-run/eslint-config/node',
        '@remix-run/eslint-config/jest-testing-library',
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
