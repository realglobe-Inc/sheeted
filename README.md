# Sheeted

Table UI web application development framework.

Sheeted aims to make it extremely easy to develop Sheet-based web applications for organizations internal use. You have only to write data models, bissiness rules, validations, and access policies, then REST API and UI will be generated automatically. You can develop practical Table UI web applications 10x faster with Sheeted.

## Features

* REST API and UI is auto generated
* Support SAML Authentication
* and more

## Installation

```console
$ npm add @sheeted/core @sheeted/server
```

## Usage

Take a look at [examples](https://github.com/realglobe-Inc/sheeted/tree/master/examples).

To create a sheet, define some type and objects as below.

[EntityBase]:https://github.com/realglobe-Inc/sheeted/blob/master/packages/core/src/EntityBase.type.ts
[Schema]:https://github.com/realglobe-Inc/sheeted/blob/master/packages/core/src/Schema.type.ts
[Model]:https://github.com/realglobe-Inc/sheeted/blob/master/packages/core/src/Schema.type.ts
[Hook]:https://github.com/realglobe-Inc/sheeted/blob/master/packages/core/src/Hook.type.ts
[Validator]:https://github.com/realglobe-Inc/sheeted/blob/master/packages/core/src/Validator.type.ts
[View]:https://github.com/realglobe-Inc/sheeted/blob/master/packages/core/src/View.type.ts
[Sheet]:https://github.com/realglobe-Inc/sheeted/blob/master/packages/core/src/Sheet.type.ts

* Entity: a raw data shape. Interface which extends [EntityBase][EntityBase].
* [Schema][Schema]: defines properties of each field in Entity.
* [Model][Model]: MongoDB [Mongoose model](https://mongoosejs.com/docs/api/model.html).
* [Hook][Hook]: functions which will be executed after creating / updating / destroying entities.
* [Validator][Validator]: defines validations on creating / updating entities.
* [View][View]: about UI such as column titles.
* [Sheet][Sheet]: the main object bundling above objects.

After defining sheets, you can create application server with `createApp()` of `@sheeted/server`. This function just returns [express](https://expressjs.com/) app.

```ts
import { createApp } from '@sheeted/server'

const app = createApp(
  {
    Sheets: [ /* Sheets here */ ],
    Roles: [ /* ... */ ],
  },
  config: {
    /* ... */
  },
)
```

## Development

Install. This project uses [yarn workspaces](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/).

```console
$ yarn install
```

Run npm scripts to build packages and examples.

```console
$ yarn build
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
