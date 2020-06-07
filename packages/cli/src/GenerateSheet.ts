import path from 'path'
import fs from 'fs'

import mkdirp from 'mkdirp'
import template from 'lodash.template'
import { paramCase } from 'change-case'

import { assertPascalCase } from './helpers'

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

export type GenerateSheetOptions = {
  entityName: string
}

export const generateSheet = async (
  distDir: string,
  { entityName }: GenerateSheetOptions,
): Promise<void> => {
  assertPascalCase(entityName)
  await Promise.all(
    Resources.map(async (resource) => {
      const templatePath = path.resolve(
        __dirname,
        '../templates/generate',
        resource + '.template',
      )
      const source = await fs.promises.readFile(templatePath, 'utf-8')
      const compiled = template(source)
      const kebab = paramCase(entityName)
      const content = compiled({
        entityNamePascal: entityName,
        entityNameKebab: kebab,
      })
      const destPath = path.join(distDir, `${kebab}.${resource}.ts`)
      await mkdirp(distDir)
      await fs.promises.writeFile(destPath, content)
      console.log(`File generated: ${destPath}`)
    }),
  )
}
