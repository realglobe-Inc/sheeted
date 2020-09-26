<!-- README.md is generated automatically. DO NOT edit manually. -->

# Sheeted

![build status](https://github.com/realglobe-Inc/sheeted/workflows/master/badge.svg)
![npm version](https://badge.fury.io/js/%40sheeted%2Fcore.svg)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Entity type](#entity-type)
  - [Schema](#schema)
  - [View](#view)
  - [AccessPolicies](#accesspolicies)
  - [Hook](#hook)
  - [Validator](#validator)
  - [Actions](#actions)
  - [Sheet](#sheet)
  - [Creating app](#creating-app)
  - [Using sheet templates](#using-sheet-templates)
  - [More information](#more-information)
- [Generated REST API](#generated-rest-api)
  - [Common request headers](#common-request-headers)
  - [List all sheets](#list-all-sheets)
  - [Get a sheet](#get-a-sheet)
  - [List entities](#list-entities)
  - [Get an entity](#get-an-entity)
  - [Create an entity](#create-an-entity)
  - [Update an entity](#update-an-entity)
  - [Delete entities](#delete-entities)
- [Development](#development)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

Sheeted is a table UI web application framework.

It aims to make it extremely easy to develop table-based web applications, which are often used for organizations internal use or for some management use. With Sheeted, you will be released from boring coding not concerned with business rules. You can develop practical Table UI web applications 10x faster with Sheeted.

Features:

* Auto generated REST API and UI
* Flexibility to define business rules such as data structure, validations, and access policies
* Authentication with SAML

## Getting Started

Sheeted provides CLI to create Sheeted app project. Run the command below:

```console
$ npx @sheeted/cli project <your_project_name>
```

The command creates a directory named `<your_project_name>` and files all you need such as package.json. Then you can start to develop in the project.

```console
$ cd <your_project_name>
$ cat README.md # You will find how to setup the project.
```

## Usage

[EntityBase]:https://realglobe-inc.github.io/sheeted/core/interfaces/_entitybase_type_.entitybase.html
[Schema]:https://realglobe-inc.github.io/sheeted/core/modules/_schema_type_.html#schema
[AccessPolicy]: https://realglobe-inc.github.io/sheeted/core/modules/_accesspolicy_type_.html#accesspolicy
[Action]: https://realglobe-inc.github.io/sheeted/core/modules/_action_type_.html#action
[Hook]:https://realglobe-inc.github.io/sheeted/core/modules/_hook_type_.html#hook
[Validator]:https://realglobe-inc.github.io/sheeted/core/modules/_validator_type_.html#validator
[View]:https://realglobe-inc.github.io/sheeted/core/modules/_view_type_.html#view
[Sheet]:https://realglobe-inc.github.io/sheeted/core/modules/_sheet_type_.html#sheet

A Sheeted web application consists of Sheets, which represent tables. A Sheet conststs of one type and some objects as below.

- Entity type
- Schema
- View
- AccessPolicies
- Hook
- Validator
- Actions

Let's take a look one by one.

### Entity type

Entity type is the data format of a row in Sheet. It's an interface in TypeScript. Every Entity must have "id" for unique identity. To ensure this, Entity type extends [EntityBase][EntityBase].

Example:

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
  readFinishedAt: number
  readMinutes: number
  publicationYear: number
  comment?: string
}
```

### Schema

[Schema][Schema] can define some properties of each field in Entitiy. It has the same fields as Entity's.

Example:

```ts
import { Types, IAM_USER_SHEET, Schema } from '@sheeted/core'

import { Genres, Formats } from '../../constants'

import { BookEntity } from './book.entity'

export const BookSchema: Schema<BookEntity> = {
  title: {
    type: Types.Text,
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
  readFinishedAt: {
    type: Types.CalendarDatetime,
    optional: true,
  },
  readMinutes: {
    type: Types.Time,
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

### View

[View][View] is about UI such as a column title.

Example:

```ts
import { View } from '@sheeted/core'
import { CALENDAR_DATETIME_FORMAT } from '@sheeted/core/build/interceptors'

import { BookEntity } from './book.entity'

export const BookView: View<BookEntity> = {
  title: 'Books',
  icon: 'menu_book',
  display: (entity) => entity.title,
  enableDetail: true,
  defaultSort: {
    field: 'title',
    order: 'asc',
  },
  columns: [
    { field: 'title', title: 'TITLE', style: { minWidth: '10em' } },
    { field: 'like', title: 'LIKE' },
    {
      field: 'price',
      title: 'PRICE',
      numericOptions: {
        formatWithIntl: {
          locales: 'ja-JP',
          options: { style: 'currency', currency: 'JPY' },
        },
      },
    },
    {
      field: 'genre',
      title: 'GENRE',
      enumLabels: { comic: 'COMIC', novel: 'NOVEL' },
    },
    {
      field: 'formats',
      title: 'FORMATS',
      enumLabels: { paper: 'PAPER', kindle: 'KINDLE' },
    },
    { field: 'url', title: 'URL', textOptions: { isLink: true } },
    { field: 'buyer', title: 'BUYER' },
    { field: 'buyDate', title: 'BUY DATE' },
    { field: 'readFinishedAt', title: 'FINISHED READING' },
    { field: 'readMinutes', title: 'READ TIME' },
    { field: 'publicationYear', title: 'YEAR OF PUBLICATION' },
    { field: 'comment', title: 'COMMENT', style: { minWidth: '15em' } },
    {
      field: 'updatedAt',
      title: 'LAST UPDATED',
      numericOptions: { formatAsDate: CALENDAR_DATETIME_FORMAT },
    },
  ],
}
```

### AccessPolicies

AccessPolicies is a set of access policies based on roles. It's an array of [AccessPolicy][AccessPolicy].

```ts
import { AccessPolicy, Context } from '@sheeted/core'

import { Roles, Role, ActionIds } from '../../constants'

import { BookEntity } from './book.entity'

export const BookAccessPolicies: AccessPolicy<BookEntity, Role>[] = [
  {
    action: 'read',
    role: Roles.DEFAULT_ROLE,
  },
  {
    action: 'create',
    role: Roles.DEFAULT_ROLE,
  },
  {
    action: 'update',
    role: Roles.EDITOR_ROLE,
    column: {
      effect: 'deny',
      columns: ['genre'],
    },
    condition: (book: BookEntity, ctx?: Context<Role>): boolean =>
      ctx?.user.id === book.buyer.id,
  },
  {
    action: 'delete',
    role: Roles.EDITOR_ROLE,
    condition: (book: BookEntity, ctx?: Context<Role>): boolean =>
      ctx?.user.id === book.buyer.id,
  },
  {
    action: 'custom',
    role: Roles.DEFAULT_ROLE,
    customActionId: ActionIds.LIKE,
  },
]
```

### Hook

[Hook][Hook] is a set of functions which will be executed after creating / updating / destroying entities.

Example:

```ts
import { Hook } from '@sheeted/core'
import { IAMUserModel } from '@sheeted/mongoose'

import { BookEntity } from './book.entity'
import { BookModel } from './book.model'

export const BookHook: Hook<BookEntity> = {
  async onCreate(book, ctx, options) {
    const user = (await IAMUserModel.findOne({ id: ctx.user.id }))!.toObject()
    if (!user) {
      throw new Error(`user not found for id "${ctx.user.id}"`)
    }
    await BookModel.updateOne(
      { id: book.id },
      {
        buyer: user,
      },
      {
        session: options.transaction,
      },
    )
  },
}
```

### Validator

[Validator][Validator] defines validations on creating / updating entities.

Example:

```ts
import { Validator, ValidationResult } from '@sheeted/core'

import { BookEntity } from './book.entity'

export const BookValidator: Validator<BookEntity> = (_ctx) => (
  input: Partial<BookEntity>,
  _current: BookEntity | null,
): ValidationResult<BookEntity> => {
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

### Actions

Actions represents custom operations to entities. It's an array of [Action][Action].

Example:

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
    perform: async (entity: BookEntity): Promise<void> => {
      await BookModel.updateOne(
        {
          id: entity.id,
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

### Sheet

Now we can define [Sheet][Sheet]. It's the main object bundling above objects.

Example:

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

### Creating app

After defining sheets, you can create application server with `createApp()`. This function just returns [express](https://expressjs.com/) app.

Function `createApp()` needs arguments as below.

* AppTitle: title of application.
* Sheets: sheets array.
* Roles: role objects array.
* DatabaseDriver: database driver. Currently only supported driver is mongo driver.
* ApiUsers: array of an api user which has userId and accessToken. This is used for API access.

Example:

```ts
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
    ApiUsers: [
      {
        userId: 'admin',
        accessToken: 'f572d396fae9206628714fb2ce00f72e94f2258f',
      },
    ],
  },
  {
    ...config,
  },
)
```

### Using sheet templates

You can create sheet source files via CLI.

```console
$ npx @sheeted/cli sheet dir/to/sheet-name
```

### More information

For more information about usage, please visit:

* [examples/](./examples)
* [API Documentation](https://realglobe-inc.github.io/sheeted/)

## Generated REST API

You can use the generated REST API. The format of a response is JSON.

### Common request headers

You need authorization header in every request which is defined in `Application.ApiUsers`.

```
Authorization: token <access token>
```

### List all sheets

```
GET /api/sheets
```

### Get a sheet

```
GET /api/sheets/:sheetName
```

### List entities

```
GET /api/sheets/:sheetName/entities
```

Parameters

| Name | Type | Description |
|:-----|:-----|:------------|
| `page` | number | a page number of list |
| `limit` | number | limit count of entities |
| `search` | string | search string |
| `sort` | array of object | sort objects |

### Get an entity

```
GET /api/sheets/:sheetName/entities/:entityId
```

### Create an entity

```
POST /api/sheets/:sheetName/entities
```

Set JSON of an entity in the request body.

### Update an entity

```
POST /api/sheets/:sheetName/entities/:entityId
```

Set JSON of changes in the request body.

### Delete entities

```
POST /api/sheets/:sheetName/entities/delete
```

Set JSON of entity ids to be deleted as below.

```json
{
  "ids": ["entityId1", "entityId2"]
}
```

## Development

Requirements:

- Node.js >= 14
- docker-compose
- direnv

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
