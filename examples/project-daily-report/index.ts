// eslint-disable-next-line @typescript-eslint/no-var-requires
;(require('dotenv') as { config: () => void }).config()

import { createApp } from '@sheeted/server'
import { MongoDriver } from '@sheeted/mongoose'

import { config } from '../util/config.util'
import { connect } from '../util/mongo.util'

import { RoleLabels } from './constants'
import { ProjectSheet } from './sheets/project/project.sheet'
import { ReportSheet } from './sheets/report/report.sheet'
import { AggregationSheet } from './sheets/aggregation/aggregation.sheet'
import { seeders } from './seeder'

void main()

async function main() {
  await connect('project-daily-report')
  await seeders.seed()

  const app = createApp(
    {
      Sheets: [ProjectSheet, ReportSheet, AggregationSheet],
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
