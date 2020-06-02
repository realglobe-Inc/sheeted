;(require('dotenv') as { config: () => void }).config()

import { connect } from '../util/mongo.util'

import { seeders } from './seeder'
import { app } from './app'

void main()

async function main() {
  await connect('book')
  await seeders.seed()

  const port = 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
