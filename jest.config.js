module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  roots: ['<rootDir>/client'],
  testMatch: [
    '<rootDir>/client/**/__tests__/**/*.js',
    '<rootDir>/client/**/*.test.js'
  ],
  collectCoverageFrom: [
    'client/**/*.js',
    '!client/**/*.test.js',
    '!client/**/__tests__/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
