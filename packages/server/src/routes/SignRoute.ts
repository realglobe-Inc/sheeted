import Router from 'express-promise-router'
import { PassportStatic } from 'passport'
import bodyParser from 'body-parser'
import qs from 'qs'
import {
  ApiPaths,
  UIPathBuilder,
  ApiPathBuilder,
} from '@sheeted/core/build/web/Paths'
import { IAMUserEntity } from '@sheeted/core'

import { JWT } from '../JWT'

export const buildSignRoutes = (
  passport: PassportStatic,
  jwt: JWT,
  options: {
    contentUrl?: string
  },
) => {
  const apiPaths = ApiPathBuilder()
  const uiPaths = UIPathBuilder()
  return Router()
    .get(
      ApiPaths.SIGN_IN,
      passport.authenticate('saml', {
        failureRedirect: apiPaths.signInPath(),
        failureFlash: true,
      }),
      async (req, res) => {
        const signInPath = uiPaths.signInPath()
        const signInUrl = options.contentUrl
          ? new URL(signInPath, options.contentUrl).toString()
          : signInPath
        res.redirect(signInUrl)
      },
    )
    .post(
      ApiPaths.SIGN_IN_CALLBACK,
      bodyParser.urlencoded({ extended: false }),
      passport.authenticate('saml', {
        failureRedirect: uiPaths.signInPath(),
        failureFlash: true,
      }),
      async (req, res) => {
        const user = req.user as IAMUserEntity
        const token = await jwt.sign(user)
        const callbackPath = uiPaths.signInCallbackPath()
        const callbackUrl = options.contentUrl
          ? new URL(callbackPath, options.contentUrl).toString()
          : callbackPath
        res.redirect(callbackUrl + '?' + qs.stringify({ token }))
      },
    )
    .post(ApiPaths.SIGN_OUT, () => {
      // JWT has no sign out on server sice
      // Just delete token on front side
    })
}
