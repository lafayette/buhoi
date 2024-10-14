/* eslint-env mocha */

const buhoi = require('../src')

exports.mochaHooks = {
  async beforeAll () {
    await buhoi.start(buhoi.config.simple({
      featuresPath: `${__dirname}/app/features`,
      publicPath: `${__dirname}/app/public`,
      webpackConfigPath: `${__dirname}/app/pages/webpack.config.js`,
      isAuthorized: (session, feature, _procedure) =>
        feature !== 'secrets' || (session && session.startsWith('dodo')),
    }))
  },
  async afterAll () {
    await buhoi.stop()
  },
}
