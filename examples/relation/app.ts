import { createApp } from '@sheeted/server'
import { MongoDriver } from '@sheeted/mongoose'

import { config } from '../util/config.util'

import { RoleLabels } from './constants'
import { EntityASheet } from './sheets/entity-a/entity-a.sheet'
import { EntityBSheet } from './sheets/entity-b/entity-b.sheet'
import { EntityCSheet } from './sheets/entity-c/entity-c.sheet'
import { EntityDSheet } from './sheets/entity-d/entity-d.sheet'

export const app = createApp(
  {
    AppTitle: 'Relation Example',
    Sheets: [EntityASheet, EntityBSheet, EntityCSheet, EntityDSheet],
    Roles: RoleLabels,
    DatabaseDriver: MongoDriver,
  },
  {
    ...config,
  },
)
