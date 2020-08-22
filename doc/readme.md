<!-- README.md is generated automatically. DO NOT edit manually. -->

# Sheeted

![build status](https://github.com/realglobe-Inc/sheeted/workflows/master/badge.svg)
![npm version](https://badge.fury.io/js/%40sheeted%2Fcore.svg)

<!-- START doctoc -->
<!-- END doctoc -->

## Overview

Sheeted is a table UI web application framework.

It aims to make it extremely easy to develop table-based web applications, which are often used for organizations internal use or for some management use. With Sheeted, you will be released from boring coding not concerned with business rules. You can develop practical Table UI web applications 10x faster with Sheeted.

Features:

* Auto generated REST API and UI
* Flexibility to define business rules such as data structure, validations, and access policies
* Authentication with SAML

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
$include ../examples/book/sheets/book/book.entity.ts
```

Schema:

```ts
$include ../examples/book/sheets/book/book.schema.ts
```

AccessPolicies:

```ts
$include ../examples/book/sheets/book/book.access-policies.ts
```

Actions:

```ts
$include ../examples/book/sheets/book/book.actions.ts
```

Hook:

```ts
$include ../examples/book/sheets/book/book.hook.ts
```

Validator:

```ts
$include ../examples/book/sheets/book/book.validator.ts
```

View:

```ts
$include ../examples/book/sheets/book/book.view.ts
```

Sheet:

```ts
$include ../examples/book/sheets/book/book.sheet.ts
```

Function `createApp()` needs arguments as below.

* AppTitle: title of application.
* Sheets: sheets array.
* Roles: role objects array.
* DatabaseDriver: database driver. Currently only supported driver is mongo driver.
* ApiUsers: array of an api user which has userId and accessToken. This is used for API access.

```ts
$include ../examples/book/app.ts
```

You can create sheet source files via CLI.

```console
$ npx @sheeted/cli generate dir/to/sheet-name
```

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
