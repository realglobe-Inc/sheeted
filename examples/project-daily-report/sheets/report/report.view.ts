import { View } from '@sheeted/core'

import { ReportEntity } from './report.entity'

export const ReportView: View<ReportEntity> = {
  title: 'Reports',
  display: (entity) => `${entity.project.name}(${entity.user.name})`,
  columns: {
    user: {
      title: 'User',
    },
    project: {
      title: 'Project',
    },
    date: {
      title: 'Working Date',
    },
    time: {
      title: 'Working Time',
    },
    detail: {
      title: 'Detail',
    },
  },
}
