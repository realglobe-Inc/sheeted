const { join } = require('path')

module.exports = {
  preset: "ts-jest",
  testTimeout: 10000,
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
};
