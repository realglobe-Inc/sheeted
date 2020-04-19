import { Document } from 'mongoose'
import passport, { PassportStatic } from 'passport'
import { v4 as uuid } from 'uuid'
import {
  Strategy as SamlStrategy,
  SamlConfig,
  VerifyWithoutRequest,
} from 'passport-saml'
import { DefaultIAMRoles, IAMUserEntity } from '@sheeted/core'
import { ApiPaths } from '@sheeted/core/build/web/Paths'

import { IAMUserModel } from './sheets/IAMUserSheet/IAMUserModel'

export const SamlPassport = (samlConfig: SamlConfig): PassportStatic => {
  passport.serializeUser((user, done) => {
    done(null, user)
  })
  passport.deserializeUser((user, done) => {
    done(null, user)
  })

  const verify: VerifyWithoutRequest = async (profile, done) => {
    if (!profile) {
      done(new Error('User not found'))
      return
    }
    const email =
      profile.nameIDFormat ===
      'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'
        ? profile.nameID
        : profile.email
    if (!email) {
      done(new Error('email address not found'))
      return
    }
    let user: IAMUserEntity & Document
    const found = await IAMUserModel.findOne({ email })
    if (found) {
      user = found
    } else {
      // TODO: name も取れるようにしたい
      // TODO: role control
      // TODO: option not to create user
      user = await IAMUserModel.create({
        id: uuid(),
        name: email.split('@').shift() || '-',
        email,
        roles: [DefaultIAMRoles.DEFAULT_ROLE],
      })
      console.log('Created:', JSON.stringify(user))
    }
    return done(null, user.toJSON())
  }
  passport.use(
    new SamlStrategy(
      {
        ...samlConfig,
        path: ApiPaths.SIGN_IN_CALLBACK,
        identifierFormat:
          'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
      },
      verify,
    ),
  )
  return passport
}
