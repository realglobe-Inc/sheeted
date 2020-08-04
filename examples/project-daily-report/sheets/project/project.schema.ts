import { Schema, Types } from '@sheeted/core'

import { ProjectEntity } from './project.entity'

export const ProjectSchema: Schema<ProjectEntity> = {
  name: {
    type: Types.Text,
  },
  startDate: {
    type: Types.CalendarDate,
  },
  finishDate: {
    type: Types.CalendarDate,
  },
}
