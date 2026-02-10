const boxen = require('boxen').default
const chalk = require('chalk')
const packageData = require('../theme/package.json')

const banner = boxen(`${chalk.bold('www.chrisvogt.me')}\nMy Personal Website\nv${packageData.version}`, {
  align: 'center',
  backgroundColor: '#9b20dc',
  borderStyle: 'round',
  borderColor: '#7319a6',
  color: 'white',
  padding: {
    top: 1,
    right: 8,
    bottom: 1,
    left: 8
  }
})

console.log(banner)

console.log(`✅  Installation succeeded: ${chalk.bold('gatsby-theme-chronogrove')}`)
