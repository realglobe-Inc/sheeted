import { program } from 'commander'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version: VERSION } = require('../package.json') as { version: string }
const COMMAND_NAME = 'sheeted'

export function CLI(argv: string[]): void {
  program.name(COMMAND_NAME).version(VERSION)

  program
    .command('generate <path>')
    .description('Generate sheet files')
    .requiredOption('-n, --entity-name <EntityName>', 'entity name (CamelCase)')
    .action(function (dirPath, { entityName }) {
      // TODO
      console.log(dirPath, entityName)
    })

  program.parse(argv)

  if (program.args.slice(2).length === 0) {
    program.help()
  }
}
