// eslint-disable-next-line @typescript-eslint/no-var-requires
;(require('dotenv') as { config: () => void }).config()

import { createApp } from '@sheeted/server'
import { MongoDriver } from '@sheeted/mongoose'

import { config } from '../util/config.util'
import { connect } from '../util/mongo.util'

import { RoleLabels } from './constants'
import { seeders } from './seeder'
import { AccountSheet } from './sheets/account/account.sheet'
import { AccountPlanSheet } from './sheets/account-plan/account-plan.sheet'
import { PlanSheet } from './sheets/plan/plan.sheet'

void main()

async function main() {
  await connect('account-management')
  await seeders.seed()

  const app = createApp(
    {
      Sheets: [AccountSheet, AccountPlanSheet, PlanSheet],
      Roles: RoleLabels,
      DatabaseDriver: MongoDriver,
    },
    config,
  )
  const port = 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
