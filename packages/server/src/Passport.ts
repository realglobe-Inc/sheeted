import passport, { PassportStatic } from 'passport'
import {
  Strategy as SamlStrategy,
  SamlConfig,
  VerifyWithoutRequest,
} from 'passport-saml'
import { DefaultIAMRoles, IAMUserEntity, Repository } from '@sheeted/core'
import { ApiPaths } from '@sheeted/core/build/web/Paths'

export const SamlPassport = (
  samlConfig: SamlConfig,
  iamUserRepository: Repository<IAMUserEntity>,
): PassportStatic => {
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
    let user: IAMUserEntity
    const found = await iamUserRepository.findOne({ email })
    if (found) {
      user = found
    } else {
      // TODO: name も取れるようにしたい
      // TODO: role control
      // TODO: option not to create user
      user = await iamUserRepository.create({
        name: email.split('@').shift() || '-',
        email,
        roles: [DefaultIAMRoles.DEFAULT_ROLE],
      })
      console.log('Created:', JSON.stringify(user))
    }
    return done(null, user)
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
