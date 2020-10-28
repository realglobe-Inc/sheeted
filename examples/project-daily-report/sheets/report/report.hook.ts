import { Hook } from '@sheeted/core'
import {
  CalendarMonthInterceptor,
  CalendarDateInterceptor,
} from '@sheeted/core/build/interceptors'

import { AggregationRepository } from '../aggregation/aggregation.repository'

import { ReportEntity } from './report.entity'
import { ReportRepository } from './report.repository'

const updateAggregation = async (report: ReportEntity, session: any) => {
  const { project } = report
  const month = CalendarMonthInterceptor.fromDate(
    CalendarDateInterceptor.toDate(report.date),
  )
  const list = await ReportRepository.find({
    filter: {
      project,
      date: {
        $gte: month * 100 + 1,
        $lt: (month + 1) * 100,
      } as any,
    },
    limit: 30,
    page: 1,
    sort: [],
  })
  const { entities: reports } = list
  const hours = reports.reduce(
    (sum, report) => sum + (report.time || 0) / 60,
    0,
  )
  const aggregation = await AggregationRepository.findOne(
    {
      project,
      month,
    },
    {
      transaction: session,
    },
  )
  if (aggregation) {
    await AggregationRepository.update(
      aggregation.id,
      { hours },
      { transaction: session },
    )
  } else {
    await AggregationRepository.create(
      {
        project,
        month,
        hours,
      },
      { transaction: session },
    )
  }
}

export const ReportHook: Hook<ReportEntity> = {
  async onCreate(report, ctx, options) {
    const { user } = ctx
    await ReportRepository.update(report.id, { user })
    await updateAggregation(report, options.transaction)
  },
  async onUpdate(report, _ctx, options) {
    await updateAggregation(report, options.transaction)
  },
}
