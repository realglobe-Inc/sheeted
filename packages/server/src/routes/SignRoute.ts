import Router from 'express-promise-router'
import bodyParser from 'body-parser'
import { Router as IRouter } from 'express'
import qs from 'qs'
import {
  ApiPaths,
  UIPathBuilder,
  ApiPathBuilder,
} from '@sheeted/core/build/web/Paths'
import { IAMUserEntity } from '@sheeted/core'

import { RouterParams } from '../types/Router.type'

export const SignRoute = ({ passport, jwt }: RouterParams): IRouter => {
  const apiPaths = ApiPathBuilder()
  const uiPaths = UIPathBuilder()
  return Router()
    .get(
      ApiPaths.SIGN_IN,
      passport.authenticate('saml', {
        failureRedirect: apiPaths.signInPath(),
        failureFlash: true,
      }),
      (req, res) => {
        const signInPath = uiPaths.signInPath()
        res.redirect(signInPath)
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
        res.redirect(callbackPath + '?' + qs.stringify({ token }))
      },
    )
    .post(ApiPaths.SIGN_OUT, () => {
      // JWT has no sign out on server sice
      // Just delete token on front side
    })
}
