const { mongod } = require('./mongod')

async function testSetup() {
  await mongod.start()
}

module.exports = testSetup
