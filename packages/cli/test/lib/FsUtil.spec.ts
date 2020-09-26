import fs from 'fs/promises'
import path from 'path'

import mkdirp from 'mkdirp'
import rimraf from 'rimraf'

import { generateFromTemplate, copyRecursively } from '../../src/utils/FsUtil'

test('generateFromTemplate()', async () => {
  const src = path.resolve(__dirname, '../fixtures/templates/test.template')
  const dest = path.resolve(
    __dirname,
    '../../tmp/test/generateFromTemplate.txt',
  )
  rimraf.sync(dest)
  await mkdirp(path.dirname(src))

  await generateFromTemplate(src, dest, { name: 'Foo' })

  expect((await fs.readFile(dest, 'utf8')).trim()).toBe('Foo')
})

test('copyRecursively()', async () => {
  const src = path.resolve(__dirname, '../fixtures/copy')
  const dest = path.resolve(__dirname, '../../tmp/test/copy')

  rimraf.sync(dest)

  await copyRecursively(src, dest, { ignore: ['ignored'] })

  await expect(
    fs.stat(path.resolve(dest, 'dir/dir/a.txt')),
  ).resolves.toBeTruthy()
  await expect(
    fs.stat(path.resolve(dest, 'dir/ignored/b.txt')),
  ).rejects.toBeTruthy()
})
