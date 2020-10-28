import { MongoDriver } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { ProjectSchema } from './project.schema'

export const ProjectRepository = new MongoDriver(
  SheetNames.PROJECT_SHEET,
  ProjectSchema,
)
