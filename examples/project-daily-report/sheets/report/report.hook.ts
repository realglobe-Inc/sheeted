import { Hook } from '@sheeted/core'
import {
  CalendarMonthInterceptor,
  CalendarDateInterceptor,
} from '@sheeted/core/build/interceptors'
import { v4 as uuid } from 'uuid'
import { CreateQuery } from 'mongoose'

import { AggregationModel } from '../aggregation/aggregation.model'
import { AggregationEntity } from '../aggregation/aggregation.entity'

import { ReportEntity } from './report.entity'
import { ReportModel } from './report.model'

const updateAggregation = async (report: ReportEntity) => {
  const { project } = report
  const month = CalendarMonthInterceptor.fromDate(
    CalendarDateInterceptor.toDate(report.date),
  )
  const reports = await ReportModel.find({
    project,
    date: {
      $gte: month * 100 + 1,
      $lt: (month + 1) * 100,
    },
  }).lean()
  const hours = reports.reduce((sum, report) => sum + report.time / 60, 0)
  const aggregation = await AggregationModel.findOne({
    project,
    month,
  })
  if (aggregation) {
    await aggregation.update({ hours })
  } else {
    await AggregationModel.create({
      id: uuid(),
      project,
      month,
      hours,
    } as CreateQuery<AggregationEntity>)
  }
}

export const ReportHook: Hook<ReportEntity> = {
  async onCreate(report, ctx) {
    const { user } = ctx
    await ReportModel.updateOne({ id: report.id }, { user })
    await updateAggregation(report)
  },
  async onUpdate(report) {
    await updateAggregation(report)
  },
}
