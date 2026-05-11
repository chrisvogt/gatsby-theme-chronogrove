// Babel config, used by Jest
// Strip page queries only from the chrisvogt.me site package when Jest compiles it from theme tests.
// Applying remove-graphql-queries to the whole repo breaks theme `useStaticQuery` JSON extraction.
const path = require('path')

const chrisvogtSiteRoot = path.join(__dirname, '..', 'www.chrisvogt.me')

module.exports = {
  presets: ['babel-preset-gatsby'],
  overrides: [
    {
      test: /www\.chrisvogt\.me[/\\].*\.jsx?$/,
      plugins: [
        [
          require.resolve('babel-plugin-remove-graphql-queries'),
          {
            stage: 'develop',
            path: chrisvogtSiteRoot
          }
        ]
      ]
    }
  ]
}
