// jest.config.js
module.exports = {
  preset: "ts-jest",
  setupFiles: ["<rootDir>/test/setupEnv.ts"],
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
