const { MongoMemoryServer } = require('mongodb-memory-server')

const MONGOMS_PORT = 52729
const MONGOMS_DB = 'test'
const MONGOMS_URI = `mongodb://127.0.0.1:${MONGOMS_PORT}/${MONGOMS_DB}`
const mongod = new MongoMemoryServer({
  autoStart: false,
  instance: {
    port: MONGOMS_PORT,
  },
})

module.exports = {
  mongod,
  MONGOMS_URI,
}
