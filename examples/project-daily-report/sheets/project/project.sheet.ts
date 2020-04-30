import { Sheet } from '@sheeted/core'

import { SheetNames, Role } from '../../constants'

import { ProjectEntity } from './project.entity'
import { ProjectSchema } from './project.schema'
import { ProjectValidator } from './project.validator'
import { ProjectView } from './project.view'
import { ProjectAccessPolicies } from './project.access-policies'

export const ProjectSheet: Sheet<ProjectEntity, Role> = {
  name: SheetNames.PROJECT_SHEET,
  Schema: ProjectSchema,
  Validator: ProjectValidator,
  View: ProjectView,
  AccessPolicies: ProjectAccessPolicies,
}
