import { createApp } from '@sheeted/server'
import { MongoDriver } from '@sheeted/mongoose'

import { config } from '../util/config.util'

import { RoleLabels } from './constants'
import { BookSheet } from './sheets/book/book.sheet'

export const app = createApp(
  {
    AppTitle: 'Book Management App',
    Sheets: [BookSheet],
    Roles: RoleLabels,
    DatabaseDriver: MongoDriver,
  },
  {
    ...config,
  },
)
