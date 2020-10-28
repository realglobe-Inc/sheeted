import path from 'path'

import { pascalCase } from 'pascal-case'
import { paramCase } from 'param-case'

import { generateFromTemplate } from './utils/FsUtil'

const Resources = [
  'access-policies',
  'actions',
  'entity',
  'hook',
  'repository',
  'schema',
  'sheet',
  'validator',
  'view',
]

const TEMPLATE_DIR = path.resolve(__dirname, '../templates/sheet')

export const generateSheet = async (destDir: string): Promise<string[]> => {
  const entityName = path.basename(destDir)
  const entityNameParam = paramCase(entityName)
  const entityNamePascal = pascalCase(entityNameParam)

  const destPaths = await Promise.all(
    Resources.map(async (resource) => {
      const templatePath = path.resolve(TEMPLATE_DIR, resource + '.template')
      const destPath = path.join(destDir, `${entityNameParam}.${resource}.ts`)
      await generateFromTemplate(templatePath, destPath, {
        entityNamePascal,
        entityNameParam,
      })
      return destPath
    }),
  )
  return destPaths
}
