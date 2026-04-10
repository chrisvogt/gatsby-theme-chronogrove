/**
 * Jest transforms @emotion and JSX; mirror theme with classic runtime.
 */
module.exports = {
  presets: [
    [require.resolve('@babel/preset-env'), { targets: { node: 'current' } }],
    [require.resolve('@babel/preset-react'), { runtime: 'classic', useBuiltIns: true }]
  ]
}
