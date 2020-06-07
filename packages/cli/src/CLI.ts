import { program } from 'commander'

import { generateSheet } from './GenerateSheet'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version: VERSION } = require('../package.json') as { version: string }
const COMMAND_NAME = 'sheeted'

export function CLI(argv: string[]): void {
  program.name(COMMAND_NAME).version(VERSION)

  program
    .command('generate <path>')
    .description('Generate sheet files')
    .action(function (distDir) {
      void generateSheet(distDir).catch((e) => {
        console.error(e)
        process.exit(1)
      })
    })

  program.parse(argv)
}
