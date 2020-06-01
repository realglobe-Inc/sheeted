/* eslint-disable @typescript-eslint/no-use-before-define */
require('dotenv').config()

import { createApp } from '@sheeted/server'
import { MongoDriver } from '@sheeted/mongoose'

import { config } from '../util/config.util'
import { connect } from '../util/mongo.util'

import { Roles } from './constants'
import { Sheet1Sheet } from './sheets/sheet1/sheet1.sheet'
import { seeders } from './seeder'

void main()

async function main() {
  await connect('sheet1')
  await seeders.seed()

  const app = createApp(
    {
      Sheets: [Sheet1Sheet],
      Roles: [
        {
          label: '管理者',
          value: Roles.ADMIN_ROLE,
        },
        {
          label: '編集可',
          value: Roles.EDITOR_ROLE,
        },
        {
          label: '一般',
          value: Roles.DEFAULT_ROLE,
        },
      ],
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
