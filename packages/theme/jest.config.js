// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

// pnpm can install multiple physical copies of `theme-ui` (different peer graphs). Jest mocks and
// `ThemeUIProvider` then apply to only one copy while `@chronogrove/ui` imports another, so
// `useColorMode` runs without ColorModeProvider. Force a single module instance.
const themeUiEntry = require.resolve('theme-ui')

module.exports = {
  // Recycle jest-worker processes before idle RAM grows large — reduces intermittent SIGSEGV when
  // multiple workers run alongside Turbo’s other packages (see root `pnpm test --concurrency=1`).
  workerIdleMemoryLimit: '512MB',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    'src/**/*(.js|!(*.spec.js|*.scss|*.json|*.snap))',
    '../../websites/www.chrisvogt.me/src/components/**/*(.js|!(*.spec.js|*.scss|*.json|*.snap))',
    '../../websites/www.chrisvogt.me/src/pages/travel.js',
    '../../websites/www.chrisvogt.me/src/pages/music.js',
    'gatsby-browser.js',
    'gatsby-node.js',
    'gatsby-ssr.js',
    'wrapPageElement.js',
    'wrapRootElement.js'
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Barrel re-export files (no logic to test); thin workspace shims to @chronogrove/ui (covered in packages/ui)
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/components/home-backgrounds/index.js',
    'src/components/skip-nav/index.js',
    'src/reducers/index.js',
    'src/components/button.js',
    'src/components/color-toggle.js',
    'src/components/action-button.js',
    'src/components/pagination-button.js',
    'src/components/pagination.js',
    'src/components/widgets/card-footer.js',
    'src/components/widgets/status-card.js',
    'src/components/widgets/widget.js',
    'src/components/widgets/metric-badge.js',
    'src/components/widgets/view-external.js',
    'src/components/widgets/call-to-action.js',
    'src/components/widgets/metric-card.js',
    'src/components/widgets/profile-metrics-badge.js',
    'src/components/widgets/widget-header.js',
    'src/components/lazy-load.js',
    'src/components/header.js',
    'src/components/category-index-layout.js',
    'src/components/skip-nav/SkipNavLink.js',
    'src/components/skip-nav/SkipNavContent.js',
    'src/helpers/isDarkMode.js',
    'src/utils/colors.js',
    'src/gatsby-plugin-theme-ui/theme.js',
    'src/components/widgets/recent-posts/thumbnail-strip.js',
    'src/components/widgets/recent-posts/image-thumbnails.js'
  ],

  // Branches stay at 90% until more branch tests land (~91% actual); stmts/lines/funcs enforced at 98%.
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 90,
      functions: 98,
      lines: 98
    }
  },

  globals: {
    __BASE_PATH__: '',
    __PATH_PREFIX__: ''
  },

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'jsx'],

  moduleNameMapper: {
    '^theme-ui$': themeUiEntry,
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/file-mock.js',
    '^@theme-toggles/react$': '<rootDir>/__mocks__/theme-toggles-react-mock.js'
  },

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ['<rootDir>/jest-shim.js', 'jest-canvas-mock'],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['@testing-library/jest-dom'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['node_modules', '\\.cache', '<rootDir>.*/public'],

  testEnvironmentOptions: {
    // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
    url: 'http://localhost'
  },

  // Transform modern JavaScript and JSX using Babel
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },

  // Allow specific ESM packages in node_modules to be transformed (pnpm uses .pnpm store)
  transformIgnorePatterns: [
    'node_modules/(?!(gatsby|@mdx-js|react-error-boundary|@chronogrove/ui|\\.pnpm)(/|$))',
    '\\.pnpm/[^/]+/node_modules/(?!(gatsby|@mdx-js|react-error-boundary|@chronogrove/ui)/)'
  ],

  // Indicates whether each individual test should be reported during the run
  verbose: false
}
