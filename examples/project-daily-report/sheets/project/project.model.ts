import { compileModel } from '@sheeted/mongoose'

import { SheetNames } from '../../constants'

import { ProjectEntity } from './project.entity'
import { ProjectSchema } from './project.schema'

export const ProjectModel = compileModel<ProjectEntity>(
  SheetNames.PROJECT_SHEET,
  ProjectSchema,
)
