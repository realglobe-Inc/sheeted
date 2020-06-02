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

* Sheets: sheets array.
* Roles: role objects array.
* DatabaseDriver: database driver. Currently only supported driver is mongo driver.

```ts
$include ../examples/book/app.ts
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
