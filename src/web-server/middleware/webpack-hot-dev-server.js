const { Router } = require('express')

module.exports = function webpackHotDevServer (webpackConfigPath) {
  const router = Router()

  if (process.env.NODE_ENV === 'development') {
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const webpack = require('webpack')
    const webpackConfig = require(webpackConfigPath)
    const compiler = webpack(webpackConfig)
    const instance = webpackDevMiddleware(compiler, { noInfo: true, lazy: false })

    router.use(instance)
    router.use(webpackHotMiddleware(compiler))

    router.dispose = () => new Promise(instance.close)
  } else {
    router.dispose = () => Promise.resolve()
  }

  return router
}
