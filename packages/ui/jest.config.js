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
    "jsx",
    "json",
    "ts",
    "tsx"
  ],
  roots: [
    "test",
  ],
  testEnvironment: "jsdom",
  testMatch: [
    "**/*.spec.[jt]s?(x)",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/build/",
  ],
  testTimeout: 10000,
};
