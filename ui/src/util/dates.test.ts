import { describe, expect, test } from '@jest/globals';

import { rsToJsDateString } from './dates';

describe('rsToJsDateString', () => {
    test.each`
        rsDate                   | expected
        ${'2023-12-13 00:28:00'} | ${'2023-12-13T00:28:00Z'}
    `('returns $expected when passed $rsDate', ({ rsDate, expected }) => {
        expect(rsToJsDateString(rsDate)).toBe(expected);
    });
});
