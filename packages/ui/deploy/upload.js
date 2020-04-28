#!/usr/bin/env node
/**
 * Command to upload static files to S3
 */
const { join } = require('path')
const { createReadStream } = require('fs')
const commander = require('commander')
const { S3, SharedIniFileCredentials } = require('aws-sdk')
const glob = require('glob')
const { version } = require('../package.json')

const BUCKET_NAME = 'sheeted'
const DIST_PATH_PREFIX = version

commander.option('--force', 'force upload')

process.chdir(join(__dirname, '..'))
const options = commander.parse(process.argv)
main(options).catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main({ force }) {
  const s3 = process.env.GITHUB_ACTIONS
    ? new S3({})
    : new S3({
        credentials: new SharedIniFileCredentials({ profile: 'sheeted' }),
      })

  const resp = await s3
    .listObjects({
      Bucket: BUCKET_NAME,
      Prefix: DIST_PATH_PREFIX,
    })
    .promise()
  const alreadyUploaded = resp.Contents.length > 1
  if (alreadyUploaded) {
    console.warn(
      `Directory s3://${BUCKET_NAME}/${DIST_PATH_PREFIX} is found. It seems to be already uploaded.`,
    )
    if (force) {
      console.log(`But we continue to upload for --force option.`)
    } else {
      return
    }
  }

  console.log('Upload static files...')
  const baseDir = join(__dirname, '../build/static')
  const files = glob.sync('**/*', { cwd: baseDir, nodir: true, dot: false })
  for (const file of files) {
    await s3
      .putObject({
        Bucket: BUCKET_NAME,
        Body: createReadStream(join(baseDir, file)),
        Key: `${DIST_PATH_PREFIX}/${file}`,
      })
      .promise()
    console.log(`Uploaded: s3://${BUCKET_NAME}/${DIST_PATH_PREFIX}/${file}`)
  }
}
