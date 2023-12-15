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
        'sort-imports': [
            'error',
            {
                ignoreCase: false,
                ignoreDeclarationSort: true, // don"t want to sort import lines, use eslint-plugin-import instead
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                allowSeparatedGroups: true,
            },
        ],
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
