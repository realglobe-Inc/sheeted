import { join } from 'path'

import { program } from 'commander'

import { generateProject } from './GenerateProject'
import { generateSheet } from './GenerateSheet'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version: VERSION } = require('../package.json') as { version: string }
const COMMAND_NAME = 'sheeted'

export function CLI(argv: string[]): void {
  program.name(COMMAND_NAME).version(VERSION)

  program
    .command('sheet <path>')
    .description('Generate sheet files')
    .action(async function (destDir) {
      const destPaths = await generateSheet(destDir).catch((e) => {
        console.error(e)
        process.exit(1)
      })
      destPaths.forEach((dest) => {
        console.log(`File generated: ${dest}`)
      })
    })

  program
    .command('project <name>')
    .description('Create new sheeted project')
    .action(async function (name: string) {
      const destDir = join(process.cwd(), name)
      await generateProject(destDir, name).catch((e) => {
        console.error(e)
        process.exit(1)
      })
    })

  program.parse(argv)
}
