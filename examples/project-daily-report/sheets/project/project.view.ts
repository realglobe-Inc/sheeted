import { View } from '@sheeted/core'

import { ProjectEntity } from './project.entity'

export const ProjectView: View<ProjectEntity> = {
  title: 'Projects',
  display: (entity) => entity.name,
  columns: {
    name: {
      title: 'Name',
    },
    startDate: {
      title: 'Start Date',
    },
    finishDate: {
      title: 'Finish Date',
    },
  },
}
