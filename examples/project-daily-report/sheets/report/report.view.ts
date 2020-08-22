import { View } from '@sheeted/core'

import { ReportEntity } from './report.entity'

export const ReportView: View<ReportEntity> = {
  title: 'Reports',
  display: (entity) => `${entity.project.name}(${entity.user.name})`,
  columns: [
    {
      field: 'user',
      title: 'User',
    },
    {
      field: 'project',
      title: 'Project',
    },
    {
      field: 'date',
      title: 'Working Date',
    },
    {
      field: 'time',
      title: 'Working Time',
    },
    {
      field: 'detail',
      title: 'Detail',
    },
  ],
}
