const { join } = require('path')

module.exports = {
  preset: "ts-jest",
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
