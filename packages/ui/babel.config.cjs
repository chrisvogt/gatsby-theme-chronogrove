// Standard automatic JSX; Theme UI `sx` is applied via @theme-ui/components (Box, etc.), not file-level jsxImportSource.
module.exports = {
  presets: [
    [require.resolve('@babel/preset-env'), { targets: { node: 'current' } }],
    [require.resolve('@babel/preset-react'), { runtime: 'automatic' }]
  ]
}
