import { createApp } from '@sheeted/server'
import { MongoDriver } from '@sheeted/mongoose'

import { config } from '../util/config.util'
import { defaultUsers } from '../util/seeder.util'

import { RoleLabels } from './constants'
import { BookSheet } from './sheets/book/book.sheet'

const admin = defaultUsers[1]

export const app = createApp(
  {
    AppTitle: 'Book Management App',
    Sheets: [BookSheet],
    Roles: RoleLabels,
    DatabaseDriver: MongoDriver,
    ApiUsers: [
      {
        userId: admin.id,
        accessToken: 'f572d396fae9206628714fb2ce00f72e94f2258f',
      },
    ],
    options: {
      iamUserView: {
        title: 'User Management',
      },
    },
  },
  {
    ...config,
  },
)
