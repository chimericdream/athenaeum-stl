import { coverageTotal } from '@betterer/coverage';

export default {
    'increase total test coverage': () =>
        coverageTotal('./coverage/coverage-summary.json'),
};
