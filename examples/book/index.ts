;(require('dotenv') as { config: () => void }).config()

import { createApp } from '@sheeted/server'
import { MongoDriver } from '@sheeted/mongoose'

import { config } from '../util/config.util'
import { connect } from '../util/mongo.util'

import { RoleLabels } from './constants'
import { BookSheet } from './sheets/book/book.sheet'
import { seeders } from './seeder'

void main()

async function main() {
  await connect('book')
  await seeders.seed()

  const app = createApp(
    {
      Sheets: [BookSheet],
      Roles: RoleLabels,
      DatabaseDriver: MongoDriver,
    },
    {
      ...config,
    },
  )

  const port = 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
