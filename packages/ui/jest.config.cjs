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
    'src/animated-page-background/index.js',
    'src/gatsby/on-route-update-color-mode.js',
    'src/theme.js',
    // Shader + WebGL: exercised via ChronogroveAnimatedPageBackground; unit-testing three.js is brittle.
    'src/animated-page-background/ColorBends.js'
  ],
  moduleNameMapper: {
    '^@theme-toggles/react$': '<rootDir>/test-utils/mock-theme-toggles-react.js',
    '\\.css$': '<rootDir>/test-utils/mock-empty.css.js'
  },
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  }
}
