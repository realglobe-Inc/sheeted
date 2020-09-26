import mongoose from 'mongoose'

import { app } from './app'

const SERVER_PORT = 3000
const MONGO_PORT = 27017
const MONGO_URL = `mongodb://localhost:${MONGO_PORT}/dev`

async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })

  app.listen(SERVER_PORT, () => {
    console.log(`http://localhost:${SERVER_PORT}`)
  })
}

void main()
