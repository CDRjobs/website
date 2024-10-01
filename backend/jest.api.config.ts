/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/api-tests/**/*.test.ts'],
  globalSetup: '<rootDir>/api-tests/setup.ts',
  globalTeardown: '<rootDir>/api-tests/teardown.ts',
}