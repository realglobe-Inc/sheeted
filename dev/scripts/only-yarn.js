#!/usr/bin/env node
/**
 * Make sure people to use `yarn install` on this project
 */
'use strict'

const byYarn = /yarn/.test(process.env.npm_execpath)
if (!byYarn) {
  const message = `
[ERROR]  Use "yarn" for installation in this project.
`
  console.error(message)
  process.exit(1)
}
