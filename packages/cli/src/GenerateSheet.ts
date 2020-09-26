import path from 'path'
import fs from 'fs'

import mkdirp from 'mkdirp'
import template from 'lodash.template'
import { pascalCase } from 'pascal-case'
import { paramCase } from 'param-case'

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

const TEMPLATE_DIR = path.resolve(__dirname, '../templates/sheet')

export const generateSheet = async (distDir: string): Promise<string[]> => {
  const entityName = path.basename(distDir)
  const entityNameParam = paramCase(entityName)
  const entityNamePascal = pascalCase(entityNameParam)

  const destPaths = await Promise.all(
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
      return destPath
    }),
  )
  return destPaths
}
