const log = require('totlog')(__filename)

module.exports = function errorHandler ({
  ValidationError,
  NotAuthorizedError,
  NotFoundError,
}) {
  return function errorHandlerMiddleware (error, req, res, next) {
    switch (true) {
      case error instanceof ValidationError: return res.status(400).json(error)
      case error instanceof NotAuthorizedError: return res.status(403).end()
      case error instanceof NotFoundError: return res.status(404).end()
      default: {
        log.error('%s %s (session %s) failed due to', req.method, req.path, req.session, error)
        return res.status(500).end()
      }
    }
  }
}
