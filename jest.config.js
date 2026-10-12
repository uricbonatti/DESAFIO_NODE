const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

const base = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};

module.exports = {
  clearMocks: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov'],
  collectCoverageFrom: ['<rootDir>/src/modules/**/services/*.ts', '!<rootDir>/src/**/*.spec.ts'],
  projects: [
    { ...base, displayName: 'unit', testMatch: ['<rootDir>/src/**/*.spec.ts'] },
    { ...base, displayName: 'e2e', testMatch: ['<rootDir>/tests/e2e/**/*.spec.ts'] },
  ],
};
