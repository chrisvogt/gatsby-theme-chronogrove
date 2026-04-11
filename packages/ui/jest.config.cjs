/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  testMatch: ['**/?(*.)+(spec|test).js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  transformIgnorePatterns: ['node_modules/(?!theme-ui)'],
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.spec.js', '!src/next/**'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/index.js',
    'src/skip-nav/index.js',
    'src/color-mode/index.js',
    'src/gatsby/index.js',
    'src/theme.js'
  ],
  moduleNameMapper: {
    '^@theme-toggles/react$': '<rootDir>/test-utils/mock-theme-toggles-react.js'
  },
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 90,
      functions: 95,
      lines: 95
    }
  }
}
