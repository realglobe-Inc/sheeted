import path from 'path'
import fs from 'fs/promises'

import phin from 'phin'

import { copyRecursively, generateFromTemplate } from './utils/FsUtil'
import { assertProjectName } from './utils/ProjectUtil'

const TEMPLATE_DIR = path.resolve(__dirname, '../templates/project')

export const generateProject = async (
  destDir: string,
  {
    projectName,
    pkgVersion,
  }: {
    projectName: string
    pkgVersion: string
  },
): Promise<void> => {
  assertProjectName(projectName)
  await fs.mkdir(destDir)

  await copyRecursively(TEMPLATE_DIR, destDir, {
    ignore: [
      'var',
      'build',
      'node_modules',
      'package.json.template',
      '.gitignore.template',
    ],
  })

  {
    const templatePath = path.resolve(TEMPLATE_DIR, 'package.json.template')
    const destPath = path.resolve(destDir, 'package.json')
    await generateFromTemplate(templatePath, destPath, {
      projectName,
      pkgVersion,
    })
  }
  {
    const templatePath = path.resolve(TEMPLATE_DIR, '.gitignore.template')
    const destPath = path.resolve(destDir, '.gitignore')
    const { body: gitignore } = await phin(
      'https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore',
    )
    await generateFromTemplate(templatePath, destPath, {
      gitignore,
    })
  }
}
