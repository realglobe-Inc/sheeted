const { join } = require('path')

module.exports = {
  preset: "ts-jest",
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  },
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.ts"
  ],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/test/"
  ],
  moduleFileExtensions: [
    "js",
    "json",
    "ts",
  ],
  roots: [
    "test",
  ],
  testEnvironment: "node",
  testMatch: [
    "**/*.spec.[jt]s",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/build/",
  ],
  testTimeout: 10000,
};
