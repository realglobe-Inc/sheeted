import fs from 'fs'
import { join } from 'path'

import Router from 'express-promise-router'
import { Request, Response, Router as IRouter } from 'express'
import template from 'lodash.template'

import { RouterParams } from '../types/Router.type'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../../package.json') as { version: string } // import にすると build/ に package.json が含まれてしまう

const JS_CDN_URL = 'https://d2nu34hyw3op89.cloudfront.net'
// TODO: 設定から読み込む
const TITLE = 'Sheeted App'

export const ContentRoute = (_params: RouterParams): IRouter => {
  // TODO: UI と共通化
  const jsUrl = new URL(`/${version}/js/sheeted.js`, JS_CDN_URL).toString()
  const htmlPath = join(__dirname, '../../assets/index.html.template')
  const htmlTemplate = fs.readFileSync(htmlPath, 'utf-8')
  const compiled = template(htmlTemplate)
  return Router().get('*', (req: Request, res: Response) => {
    const { protocol } = req
    const host = req.get('host')
    if (!host) {
      throw new Error(`Empty host`)
    }
    const apiUrl = `${protocol}://${host}`
    const html = compiled({ title: TITLE, apiUrl, jsUrl })
    res.send(html)
  })
}
