module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/tests/jest.setup.js"],
  transform: {
    "^.+\\.js$": "babel-jest"
  }
};