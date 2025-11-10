const react = require('eslint-plugin-react')
const jsxA11Y = require('eslint-plugin-jsx-a11y')
const prettier = require('eslint-plugin-prettier')
const js = require('@eslint/js')
const globals = require('globals')

const browserGlobals = Object.fromEntries(Object.entries(globals.browser).filter(([key]) => key.trim() === key))

module.exports = [
  {
    ignores: [
      '**/*.json',
      '**/node_modules/**',
      '**/theme/public/**',
      '**/www.chrisvogt.me/public/**',
      '**/www.chronogrove.com/public/**',
      '**/.cache/**'
    ]
  },
  {
    files: ['theme/**/*.js', 'www.chrisvogt.me/**/*.js']
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Explicitly define browser globals we want to use
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        requestAnimationFrame: 'readonly',
        // Node.js globals
        ...globals.node
      }
    }
  },
  js.configs.recommended,
  {
    plugins: {
      react,
      'jsx-a11y': jsxA11Y,
      prettier
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: false,
          trailingComma: 'none',
          bracketSpacing: true,
          arrowParens: 'avoid',
          jsxSingleQuote: true
        }
      ],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$' }]
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    plugins: {
      json: require('eslint-plugin-json')
    },
    files: ['**/*.json'],
    rules: {
      'json/*': 'error'
    }
  },
  {
    files: ['**/*.spec.js', 'theme/jest-shim.js'], // Target Jest spec files
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.jest, // Include Jest globals for describe, it, etc.
        ...browserGlobals, // Filtered browser globals
        getComputedStyle: 'readonly',
        Event: 'readonly',
        HTMLCanvasElement: 'readonly',
        requestAnimationFrame: 'readonly'
      }
    },
    plugins: {
      jest: require('eslint-plugin-jest') // Add Jest plugin
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error'
    }
  }
]
