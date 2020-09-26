import path from 'path'
import fs from 'fs/promises'

import { copyRecursively, generateFromTemplate } from './utils/FsUtil'
import { assertProjectName } from './utils/ProjectUtil'

const TEMPLATE_DIR = path.resolve(__dirname, '../templates/project')

const TEMPLATES = [{ template: 'package.json.template', dest: 'package.json' }]

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
    ignore: ['var', 'build', 'node_modules', 'package.json.template'],
  })

  for (const { template, dest } of TEMPLATES) {
    const templatePath = path.resolve(TEMPLATE_DIR, template)
    const destPath = path.resolve(destDir, dest)
    await generateFromTemplate(templatePath, destPath, {
      projectName,
      pkgVersion,
    })
  }
}
