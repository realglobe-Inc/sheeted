import path from 'path'
import fs from 'fs'

import mkdirp from 'mkdirp'
import template from 'lodash.template'
import { pascalCase, paramCase } from 'change-case'

const Resources = [
  'access-policies',
  'actions',
  'entity',
  'hook',
  'model',
  'schema',
  'sheet',
  'validator',
  'view',
]

const TEMPLATE_DIR = path.resolve(__dirname, '../templates/generate')

export const generateSheet = async (distDir: string): Promise<void> => {
  const entityName = path.basename(distDir)
  const entityNameParam = paramCase(entityName)
  const entityNamePascal = pascalCase(entityNameParam)

  await Promise.all(
    Resources.map(async (resource) => {
      const templatePath = path.resolve(TEMPLATE_DIR, resource + '.template')
      const source = await fs.promises.readFile(templatePath, 'utf-8')
      const compiled = template(source)
      const content = compiled({
        entityNamePascal,
        entityNameParam,
      })
      const destPath = path.join(distDir, `${entityNameParam}.${resource}.ts`)
      await mkdirp(distDir)
      await fs.promises.writeFile(destPath, content)
      console.log(`File generated: ${destPath}`)
    }),
  )
}
