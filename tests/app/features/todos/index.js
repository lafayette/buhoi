const sinon = require('sinon')

const publicProcedureSpy = sinon.spy()

module.exports = {
  publicProcedure,
  publicProcedureSpy,
  cachedPublicProcedure,
  privateProcedure,
}

function publicProcedure (...args) {
  // @public
  publicProcedureSpy(...args)
  return Promise.resolve([1, 2, 3])
}

function cachedPublicProcedure (...args) {
  // @public
  // @cache 1 min
  return new Date()
}

function privateProcedure () {
  return NaN
}
