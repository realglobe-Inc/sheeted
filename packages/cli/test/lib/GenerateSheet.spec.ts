import path from 'path'
import { exec } from 'child_process'

import { generateSheet } from '../../src/GenerateSheet'

const tsconfigPath = path.resolve(__dirname, '../../tsconfig.test-sheet.json')

test('generateSheet()', async () => {
  const distDir = path.resolve(__dirname, '../../tmp/test')
  await generateSheet(distDir)

  await new Promise((resolve, reject) => {
    exec(`tsc -p ${tsconfigPath}`, (error, stdout) => {
      if (error) {
        // tsc error は stdout に出力される
        console.error(stdout)
        reject(error)
        return
      }
      resolve(stdout)
    })
  })
})
