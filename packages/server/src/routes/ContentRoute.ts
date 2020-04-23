import fs from 'fs'
import { join } from 'path'

import Router from 'express-promise-router'
import { Request, Response } from 'express'
import template from 'lodash.template'

import { RouterParams } from '../types/Router.type'
import { version } from '../../package.json'

const JS_CDN_URL = 'https://d2nu34hyw3op89.cloudfront.net'
const TITLE = 'Sheeted App'

export const ContentRoute = (_params: RouterParams) => {
  // TODO: UI と共通化
  const jsUrl = new URL(`/${version}/js/sheeted.js`, JS_CDN_URL).toString()
  const htmlPath = join(__dirname, '../../assets/index.html.template')
  const htmlTemplate = fs.readFileSync(htmlPath, 'utf-8')
  const compiled = template(htmlTemplate)
  return Router().get('*', async (req: Request, res: Response) => {
    const { protocol } = req
    const host = req.get('host')
    const apiUrl = `${protocol}://${host}`
    const html = compiled({ title: TITLE, apiUrl, jsUrl })
    res.send(html)
  })
}
