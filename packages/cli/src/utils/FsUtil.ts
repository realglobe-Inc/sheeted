import fs from 'fs/promises'
import { dirname, resolve } from 'path'

import template from 'lodash.template'
import mkdirp from 'mkdirp'

export const copyRecursively = async (
  src: string,
  dest: string,
  options: { ignore: string[] },
): Promise<void> => {
  const { ignore } = options
  await mkdirp(dest)
  const names = (await fs.readdir(src)).filter((name) => !ignore.includes(name))
  for (const name of names) {
    const srcPath = resolve(src, name)
    const destPath = resolve(dest, name)
    const stats = await fs.stat(srcPath)
    if (stats.isFile()) {
      await fs.copyFile(srcPath, destPath)
    }
    if (stats.isDirectory()) {
      await copyRecursively(srcPath, destPath, options)
    }
  }
}

export const generateFromTemplate = async (
  templatePath: string,
  dest: string,
  data: Record<string, string>,
): Promise<void> => {
  const source = await fs.readFile(templatePath, 'utf-8')
  const compiled = template(source)
  const content = compiled(data)
  await mkdirp(dirname(dest))
  await fs.writeFile(dest, content)
}
