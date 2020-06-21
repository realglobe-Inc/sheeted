import React, { FC } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { SnackbarProvider, useSnackbar } from 'notistack'
import {
  makeStyles,
  createStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles'
import teal from '@material-ui/core/colors/teal'
import amber from '@material-ui/core/colors/amber'

import { Routes } from './Routes'
import { useMountEffect } from './hooks/utils/MountEffectHook'
import { useUserContext, UserContextProvider } from './hooks/UserContextHook'
import { LocaleContextProvider, useLocale } from './hooks/LocaleContextHook'
import { SheetContextProvider } from './hooks/SheetContextHook'
import { MenuContextProvider } from './hooks/MenuContextHook'
import { TopErrorBoundary } from './components/TopErrorBoundary'
import { handleGlobalError } from './utils/ErrorUtil'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[600],
      light: teal[50],
    },
    secondary: {
      main: amber[800],
      light: amber[100],
    },
  },
})

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
  const { trigger: triggerUserSync } = useUserContext()
  const l = useLocale()
  const { enqueueSnackbar } = useSnackbar()
  useMountEffect(() => {
    triggerUserSync()
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
        <ThemeProvider theme={theme}>
          <AppMain />
        </ThemeProvider>
      </TopErrorBoundary>
    </>
  )
})
