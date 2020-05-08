/**
 * TypeDoc config file. https://typedoc.org/guides/options/
 * Config values are switched with environment variable "PACKAGE"
 */
const { PACKAGE } = process.env

const base = {
  mode: 'file',
  tsconfig: 'tsconfig.eslint.json',
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: true,
  stripInternal: true,
  includeDeclarations: true,
}

const configs = {
  core: {
    mode: 'modules',
    out: 'doc/core',
    readme: 'packages/core/README.doc.md',
    inputFiles: ['packages/core/src'],
    exclude: ['packages/core/src/web', 'packages/core/src/sheets'],
  },
  server: {
    out: 'doc/server',
    readme: 'packages/server/README.doc.md',
    inputFiles: ['packages/server/src/index.ts', 'packages/server/src/types/ApplicationConfig.type.ts', 'packages/server/src/typings'],
    externalPattern: ['packages/server/src/typings/*.d.ts'],
  },
  mongoose: {
    out: 'doc/mongoose',
    readme: 'packages/server/README.doc.md',
    inputFiles: ['packages/mongoose/src']
  },
}

const config = configs[PACKAGE]
if (!config) {
  throw new Error(`Error in typedoc.js: invalid environment variable PACKAGE="${PACKAGE}"`)
}

module.exports = {
  ...base,
  ...config,
}
