import { CalendarDateInterceptor } from '@sheeted/core/build/interceptors'
import { createEntityId } from '@sheeted/mongoose'

import { Seeder, reduce } from '../util/seeder.util'

import { ProjectEntity } from './sheets/project/project.entity'
import { ProjectRepository } from './sheets/project/project.repository'

export const seeders = reduce([
  new Seeder<ProjectEntity>(
    ProjectRepository,
    Array.from({ length: 50 }).map((_, i) => ({
      id: createEntityId(i),
      name: 'Project ' + String(i),
      startDate: CalendarDateInterceptor.parse('2020/04/01'),
      finishDate: CalendarDateInterceptor.parse('2021/03/31'),
    })),
  ),
])
