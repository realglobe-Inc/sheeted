const { mongod } = require('./mongod')

module.exports = async function globalTeardown() {
  await mongod.stop()
}
