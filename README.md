<!-- README.md is generated automatically. DO NOT edit manually. -->

# Sheeted

Table UI web application development framework.

Sheeted aims to make it extremely easy to develop Sheet-based web applications for organizations internal use. You have only to write data models, bissiness rules, validations, and access policies, then REST API and UI will be generated automatically. You can develop practical Table UI web applications 10x faster with Sheeted.

## Features

* REST API and UI is auto generated
* Support SAML Authentication
* Easy to deploy
* and more

## Installation

Install the core library (@sheeted/core), the server library (@sheeted/server), and the database driver library (@sheeted/mongoose).

```console
$ npm add @sheeted/core @sheeted/server @sheeted/mongoose
```

## Usage

To create a sheet, define some type and objects as below.

[EntityBase]:https://realglobe-inc.github.io/sheeted/core/interfaces/_entitybase_type_.entitybase.html
[Schema]:https://realglobe-inc.github.io/sheeted/core/modules/_schema_type_.html#schema
[AccessPolicy]: https://realglobe-inc.github.io/sheeted/core/modules/_accesspolicy_type_.html#accesspolicy
[Action]: https://realglobe-inc.github.io/sheeted/core/modules/_action_type_.html#action
[Hook]:https://realglobe-inc.github.io/sheeted/core/modules/_hook_type_.html#hook
[Validator]:https://realglobe-inc.github.io/sheeted/core/modules/_validator_type_.html#validator
[View]:https://realglobe-inc.github.io/sheeted/core/modules/_view_type_.html#view
[Sheet]:https://realglobe-inc.github.io/sheeted/core/modules/_sheet_type_.html#sheet

* Entity: a raw data shape. Interface which extends [EntityBase][EntityBase].
* [Schema][Schema]: defines properties of each field in Entity.
* AccessPolicies: Access policies based on roles. Array of [AccessPolicy][AccessPolicy].
* Actions: Custom operations to entities. Array of [Action][Action].
* [Hook][Hook]: functions which will be executed after creating / updating / destroying entities.
* [Validator][Validator]: defines validations on creating / updating entities.
* [View][View]: about UI such as column titles.
* [Sheet][Sheet]: the main object bundling above objects.

After defining sheets, you can create application server with `createApp()` of `@sheeted/server`. This function just returns [express](https://expressjs.com/) app.

Here are examples.

Entity:

```ts
import { EntityBase, IAMUserEntity } from '@sheeted/core'

import { Genre, Format } from '../../constants'

export interface BookEntity extends EntityBase {
  title: string
  like: number
  price: number
  genre: Genre
  formats: Format[]
  url?: string
  buyer: IAMUserEntity
  buyDate: number
  publicationYear: number
  comment?: string
}
```

Schema:

```ts
import { Types, IAM_USER_SHEET, Schema } from '@sheeted/core'

import { Genres, Formats } from '../../constants'

import { BookEntity } from './book.entity'

export const BookSchema: Schema<BookEntity> = {
  title: {
    type: Types.Text,
    searchable: true,
    unique: true,
  },
  like: {
    type: Types.Numeric,
    readonly: true,
  },
  price: {
    type: Types.Numeric,
  },
  genre: {
    type: Types.Enum,
    enumProperties: {
      values: Genres,
    },
  },
  formats: {
    type: Types.EnumList,
    enumProperties: {
      values: Formats,
    },
  },
  url: {
    type: Types.Text,
    optional: true,
  },
  buyer: {
    type: Types.Entity,
    readonly: true,
    entityProperties: {
      sheetName: IAM_USER_SHEET,
    },
  },
  buyDate: {
    type: Types.CalendarDate,
  },
  publicationYear: {
    type: Types.CalendarYear,
  },
  comment: {
    type: Types.LongText,
    optional: true,
  },
}
```

AccessPolicies:

```ts
import { AccessPolicy } from '@sheeted/core'

import { Roles, Role, ActionIds } from '../../constants'

import { BookEntity } from './book.entity'

export const BookAccessPolicies: AccessPolicy<BookEntity, Role>[] = [
  {
    action: 'read',
    role: Roles.DEFAULT_ROLE,
  },
  {
    action: 'create',
    role: Roles.EDITOR_ROLE,
    uneditableColumns: [],
  },
  {
    action: 'update',
    role: Roles.EDITOR_ROLE,
    uneditableColumns: [],
    condition: (book, ctx) => ctx?.user.id === book.buyer.id,
  },
  {
    action: 'delete',
    role: Roles.EDITOR_ROLE,
    condition: (book, ctx) => ctx?.user.id === book.buyer.id,
  },
  {
    action: 'custom',
    role: Roles.DEFAULT_ROLE,
    customActionId: ActionIds.LIKE,
  },
]
```

Actions:

```ts
import { Action } from '@sheeted/core'

import { ActionIds } from '../../constants'

import { BookEntity } from './book.entity'
import { BookModel } from './book.model'

export const BookActions: Action<BookEntity>[] = [
  {
    id: ActionIds.LIKE,
    title: 'Increment like count',
    icon: 'exposure_plus_1',
    perform: async (entities) => {
      await BookModel.updateMany(
        {
          id: {
            $in: entities.map(({ id }) => id),
          },
        },
        {
          $inc: {
            like: 1,
          },
        },
      )
    },
  },
]
```

Hook:

```ts
import { Hook } from '@sheeted/core'
import { IAMUserModel } from '@sheeted/mongoose'

import { BookEntity } from './book.entity'
import { BookModel } from './book.model'

export const BookHook: Hook<BookEntity> = {
  async onCreate(book, ctx) {
    const user = (await IAMUserModel.findOne({ id: ctx.user.id }))!.toObject()
    await BookModel.updateOne(
      { id: book.id },
      {
        buyer: user,
      },
    )
    console.log('success')
  },
}
```

Validator:

```ts
import { Validator, ValidationResult } from '@sheeted/core'

import { BookEntity } from './book.entity'

export const BookValidator: Validator<BookEntity> = (_ctx) => (
  input,
  _current,
) => {
  const result = new ValidationResult<BookEntity>()
  if (input.price) {
    if (!Number.isInteger(input.price)) {
      result.appendError({
        field: 'price',
        message: 'Must be integer',
      })
    }
    if (input.price < 0) {
      result.appendError({
        field: 'price',
        message: 'Must be greater than or equal to 0',
      })
    }
  }
  return result
}
```

View:

```ts
import { View } from '@sheeted/core'

import { BookEntity } from './book.entity'

export const BookView: View<BookEntity> = {
  title: 'Books',
  display: (entity) => entity.title,
  // enableDetail: true,
  columns: {
    title: {
      title: 'TITLE',
    },
    like: {
      title: 'LIKE',
    },
    price: {
      title: 'PRICE',
    },
    genre: {
      title: 'GENRE',
      enumLabels: {
        comic: 'COMIC',
        novel: 'NOVEL',
      },
    },
    formats: {
      title: 'FORMATS',
      enumLabels: {
        paper: 'PAPER',
        kindle: 'KINDLE',
      },
    },
    url: {
      title: 'URL',
      textOptions: {
        isLink: true,
      },
    },
    buyer: {
      title: 'BUYER',
    },
    buyDate: {
      title: 'BUY DATE',
    },
    publicationYear: {
      title: 'YEAR OF PUBLICATION',
    },
    comment: {
      title: 'COMMENT',
    },
  },
}
```

Sheet:

```ts
import { Sheet } from '@sheeted/core'

import { Role, SheetNames } from '../../constants'

import { BookEntity } from './book.entity'
import { BookSchema } from './book.schema'
import { BookValidator } from './book.validator'
import { BookView } from './book.view'
import { BookAccessPolicies } from './book.access-policies'
import { BookActions } from './book.actions'
import { BookHook } from './book.hook'

export const BookSheet: Sheet<BookEntity, Role> = {
  name: SheetNames.BOOK,
  Schema: BookSchema,
  Validator: BookValidator,
  View: BookView,
  AccessPolicies: BookAccessPolicies,
  Actions: BookActions,
  Hook: BookHook,
}
```

Function `createApp()` needs arguments as below.

* Sheets: sheets array.
* Roles: role objects array.
* DatabaseDriver: database driver. Currently only supported driver is mongo driver.

```ts
import { createApp } from '@sheeted/server'
import { MongoDriver } from '@sheeted/mongoose'

import { config } from '../util/config.util'

import { RoleLabels } from './constants'
import { BookSheet } from './sheets/book/book.sheet'

export const app = createApp(
  {
    Sheets: [BookSheet],
    Roles: RoleLabels,
    DatabaseDriver: MongoDriver,
  },
  {
    ...config,
  },
)
```

For more information, please visit:

* [examples/](./examples)
* [API Documentation](https://realglobe-inc.github.io/sheeted/)

## Development

Install. This project uses [yarn workspaces](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/).

```console
$ yarn install
```

Run docker containers.

```console
$ docker-compose up -d
```

Run UI development server.

```console
$ yarn w/ui start
```

Run an example app server.

```console
$ node examples/build/account-management
```

Then, access to http://localhost:3000 on your browser and log in with `demo/demo`.