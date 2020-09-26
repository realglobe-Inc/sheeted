#!/usr/bin/env node
/**
 * Script to bump version in each package
 * 引数を指定すればそれがバージョンになり、指定しなければパッチバージョンを上げる
 */
const fs = require('fs').promises
const { join } = require('path')
const { version: currentVersion } = require('../../package.json')

const editJson = async (filePath, update) => {
  const json = JSON.parse(await fs.readFile(filePath, 'utf-8'))
  const edited = update(json)
  await fs.writeFile(filePath, JSON.stringify(edited, null, 2) + '\n')
}
const validateVersion = (version) => {
  const isValid = version.split('.').map(Number).every((n) => Number.isInteger(n))
  if (!isValid) {
    throw new Error(`Invalid version: ${version}`)
  }
}
const updatePatchVersion = (version) => {
  const [major, minor, patch] = version.split('.').map(Number)
  return [major, minor, patch + 1].join('.')
}
const updatePackageVersions = async (version = updatePatchVersion(currentVersion)) => {
  validateVersion(version)
  const updateVersion = (pkg) => {
    pkg.version = version
    return pkg
  }
  await editJson('package.json', updateVersion)
  await editJson('packages/cli/package.json', updateVersion)
  await editJson('packages/core/package.json', updateVersion)
  await editJson('packages/mongoose/package.json', (pkg) => {
    pkg = updateVersion(pkg)
    pkg.peerDependencies['@sheeted/core'] = version
    return pkg
  })
  await editJson('packages/server/package.json', (pkg) => {
    pkg = updateVersion(pkg)
    pkg.dependencies['@sheeted/core'] = version
    return pkg
  })
  await editJson('packages/ui/package.json', updateVersion)
}

// --- main script

const [,, newVersion] = process.argv
process.chdir(join(__dirname, '../..'))
updatePackageVersions(newVersion).catch((e) => {
  console.error(e)
  process.exit(1)
})
