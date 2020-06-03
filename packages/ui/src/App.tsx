import React, { FC } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { SnackbarProvider, useSnackbar } from 'notistack'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import { Routes } from './Routes'
import { useMountEffect } from './hooks/utils/MountEffectHook'
import { LocalStorageKeys, useLocalStorage } from './hooks/LocalStorageHook'
import { useApi } from './hooks/ApiHook'
import { useUserContext, UserContextProvider } from './hooks/UserContextHook'
import { LocaleContextProvider, useLocale } from './hooks/LocaleContextHook'
import { SheetContextProvider } from './hooks/SheetContextHook'
import { MenuContextProvider } from './hooks/MenuContextHook'
import { TopErrorBoundary } from './components/TopErrorBoundary'
import { handleGlobalError } from './utils/ErrorUtil'

const useGlobalStyles = makeStyles(() =>
  createStyles({
    '@global': {
      body: {
        margin: 0,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        overscrollBehaviorX: 'none',
      },
      code: {
        fontFamily:
          "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
      },
    },
  }),
)

const withSnackbarProvider = (Component: FC) => () => {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      autoHideDuration={6000}
      dense
    >
      <Component />
    </SnackbarProvider>
  )
}

const withContextProviders = (Component: FC) => () => {
  return (
    <MenuContextProvider>
      <UserContextProvider>
        <LocaleContextProvider>
          <SheetContextProvider>
            <Component />
          </SheetContextProvider>
        </LocaleContextProvider>
      </UserContextProvider>
    </MenuContextProvider>
  )
}

export const AppMain = withContextProviders(() => {
  const api = useApi()
  const storage = useLocalStorage()
  const { trigger: triggerUserSync } = useUserContext()
  const l = useLocale()
  const { enqueueSnackbar } = useSnackbar()
  useMountEffect(() => {
    const token = storage.getToken()
    if (token) {
      api.token = token
    }
    triggerUserSync()
    window.addEventListener('storage', (event) => {
      if (event.key === LocalStorageKeys.TOKEN) {
        const token = event.newValue ?? ''
        api.token = token
        triggerUserSync()
      }
    })
    handleGlobalError((err) => {
      console.error(err)
      enqueueSnackbar(l.errors.unexpectedError, {
        variant: 'error',
      })
    })
  })
  return <Routes base="/" />
})

export const App = withSnackbarProvider(() => {
  useGlobalStyles()
  return (
    <>
      <CssBaseline />
      <TopErrorBoundary>
        <AppMain />
      </TopErrorBoundary>
    </>
  )
})
