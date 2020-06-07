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
    .action(async function (distDir) {
      const destPaths = await generateSheet(distDir).catch((e) => {
        console.error(e)
        process.exit(1)
      })
      destPaths.forEach((dest) => {
        console.log(`File generated: ${dest}`)
      })
    })

  program.parse(argv)
}
