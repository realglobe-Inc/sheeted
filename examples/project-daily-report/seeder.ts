import { CalendarDateInterceptor } from '@sheeted/core/build/interceptors'

import { Seeder, reduce } from '../util/seeder.util'

import { ProjectEntity } from './sheets/project/project.entity'
import { ProjectModel } from './sheets/project/project.model'

export const seeders = reduce([
  new Seeder<ProjectEntity>(
    ProjectModel,
    Array.from({ length: 50 }).map((_, i) => ({
      id: 'project-' + i,
      name: 'Project ' + i,
      startDate: CalendarDateInterceptor.parse('2020/04/01'),
      finishDate: CalendarDateInterceptor.parse('2021/03/31'),
    })),
  ),
])
