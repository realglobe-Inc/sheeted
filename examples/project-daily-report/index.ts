/* eslint-disable @typescript-eslint/no-use-before-define */
require('dotenv').config()

import { createApp } from '@sheeted/server'

import { config } from '../util/config.util'
import { connect } from '../util/mongo.util'

import { RoleLabels } from './constants'
import { ProjectSheet } from './sheets/project/project.sheet'
import { ReportSheet } from './sheets/report/report.sheet'
import { AggregationSheet } from './sheets/aggregation/aggregation.sheet'

main()

async function main() {
  await connect('project-daily-report')

  const app = createApp(
    {
      Sheets: [ProjectSheet, ReportSheet, AggregationSheet],
      Roles: RoleLabels,
    },
    config,
  )
  const port = 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
