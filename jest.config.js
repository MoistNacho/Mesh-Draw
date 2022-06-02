// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Stop running tests after the first failure
  bail: true,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "jest.config.js",
    "src/apiClients",
  ],

  coverageReporters: ["lcov", "text", "json-summary", "clover"],

  // A set of global variables that need to be available in all test environments
  globals: {
    "ts-jest": {
      babelConfig: ".babelrc",
      tsConfig: "tsconfig.json",
    },
    VERSION: "0.0.0-jest",
  },

  setupFiles: ["./jest.setup.js"],

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ["node_modules", "src"],

  // An array of file extensions your modules use
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],

  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    // we'll use commonjs version of lodash for tests 👌
    // because we don't need to use any kind of tree shaking right?!
    "^lodash-es$": "<rootDir>/node_modules/lodash/index.js",
  },

  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest/presets/js-with-ts",

  transformIgnorePatterns: ["/node_modules/(?!@meshkorea)"],

  // The glob patterns Jest uses to detect test files
  testMatch: ["<rootDir>/src/**/*.spec.+(ts|tsx)"],
};
