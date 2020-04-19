import React, { FC, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
  useHistory,
} from 'react-router-dom'
import { UIPaths } from '@sheeted/core/build/web/Paths'

import { useUIPaths } from './hooks/UIPathHook'
import { SheetPage } from './pages/sheet/SheetPage'
import {
  SheetHomePage,
  SheetContextSyncAction,
} from './pages/sheet-home/SheetHomePage'
import { HomePage } from './pages/home/HomePage'
import { SignInPage } from './pages/sign-in/SignInPage'
import { SignInCallbackPage } from './pages/sign-in-callback/SignInCallbackPage'
import { SignOutPage } from './pages/sign-out/SignOutPage'
import { useUserContext } from './hooks/UserContextHook'

const PrivateRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const { ready, user } = useUserContext()
  const history = useHistory()
  const uiPaths = useUIPaths()
  const notLoggedIn = ready && !user
  useEffect(() => {
    if (notLoggedIn) {
      history.push(uiPaths.signInPath())
    }
  }, [notLoggedIn, history, uiPaths])
  return <Route {...rest}>{user ? children : null}</Route>
}

export const Routes: FC<{ base: string }> = ({ base }) => (
  <Router basename={base}>
    <Switch>
      <Route path={UIPaths.HOME} exact>
        <HomePage />
      </Route>
      <Route path={UIPaths.SIGN_IN} exact>
        <SignInPage />
      </Route>
      <Route path={UIPaths.SIGN_IN_CALLBACK} exact>
        <SignInCallbackPage />
      </Route>
      <Route path={UIPaths.SIGN_OUT} exact>
        <SignOutPage />
      </Route>
      <PrivateRoute path={UIPaths.SHEET_HOME} exact>
        <SheetHomePage />
      </PrivateRoute>
      <PrivateRoute path={UIPaths.SHEET} exact>
        <SheetPage />
      </PrivateRoute>
    </Switch>
    <PrivateRoute path={UIPaths.SHEET_HOME}>
      <SheetContextSyncAction />
    </PrivateRoute>
  </Router>
)
