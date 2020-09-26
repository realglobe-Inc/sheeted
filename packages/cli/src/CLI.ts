import { join } from 'path'

import { program } from 'commander'

import { generateProject } from './GenerateProject'
import { generateSheet } from './GenerateSheet'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version: VERSION } = require('../package.json') as { version: string }
const COMMAND_NAME = 'sheeted'

const bold = (str: string) => '\x1b[1m' + str + '\x1b[0m'

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
    .action(async function (projectName: string) {
      const destDir = join(process.cwd(), projectName)
      await generateProject(destDir, {
        projectName,
        pkgVersion: VERSION,
      }).catch((e) => {
        console.error(e)
        process.exit(1)
      })
      console.log(`
A new Sheeted project is created in ${bold(projectName)}/.
Move to the project and enjoy your development!

\`\`\`
$ cd ${projectName}/
$ cat README.md
\`\`\``)
    })

  program.parse(argv)
}
