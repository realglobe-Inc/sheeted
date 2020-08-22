import { View } from '@sheeted/core'

import { ProjectEntity } from './project.entity'

export const ProjectView: View<ProjectEntity> = {
  title: 'Projects',
  display: (entity) => entity.name,
  columns: [
    {
      field: 'name',
      title: 'Name',
    },
    {
      field: 'startDate',
      title: 'Start Date',
    },
    {
      field: 'finishDate',
      title: 'Finish Date',
    },
  ],
}
