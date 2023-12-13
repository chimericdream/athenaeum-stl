import type { Config } from 'jest';

const config: Config = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,ts,tsx}'],
    coverageReporters: ['clover', 'json', 'json-summary', 'lcov', 'text'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'jest-environment-jsdom',
    // testEnvironment: 'node',
    preset: 'ts-jest',
};

export default config;
