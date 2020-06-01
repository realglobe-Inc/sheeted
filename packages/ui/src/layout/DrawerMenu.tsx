import React, { FC } from 'react'
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListSubheader from '@material-ui/core/ListSubheader'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'
import { IAM_USER_SHEET } from '@sheeted/core'

import { Link } from '../components/Link'
import { DRAWER_WIDTH } from '../Constants'
import { useUserContext } from '../hooks/UserContextHook'
import { useSheetContext } from '../hooks/SheetContextHook'
import { useCurrentSheet } from '../hooks/CurrentSheetHook'
import { useLocale } from '../hooks/LocaleContextHook'
import { useMenuContext } from '../hooks/MenuContextHook'
import { useUIPaths } from '../hooks/UIPathHook'

import { useSheetGroups } from './hooks/SheetGroupsHook'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
    paper: {
      width: DRAWER_WIDTH,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    user: {
      padding: theme.spacing(0, 2),
      color: '#888',
    },
    divider: {
      marginTop: 4,
      marginBottom: 4,
    },
    signOut: {
      marginTop: 32,
    },
  }),
)

export const DrawerMenu: FC = () => {
  const l = useLocale()
  const classes = useStyles()
  const theme = useTheme()
  const uiPaths = useUIPaths()
  const { isOpen, closeMenu } = useMenuContext()
  const { user } = useUserContext()
  const {
    sheets: { sheets, groups },
  } = useSheetContext()
  const sheetGroups = useSheetGroups({ sheets, groups })
  const currentSheet = useCurrentSheet()
  const iamSheet = sheets.find(({ sheetName }) => sheetName === IAM_USER_SHEET)
  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={isOpen}
      classes={{
        paper: classes.paper,
      }}
    >
      <div className={classes.header}>
        <IconButton onClick={closeMenu}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Typography
        className={classes.user}
        variant="caption"
        display="block"
        gutterBottom
      >
        {user?.email}
      </Typography>
      <Divider className={classes.divider} variant="middle" />
      <List>
        {sheetGroups.flatMap(({ title, sheets }) => [
          title ? <ListSubheader>{title}</ListSubheader> : null,
          ...sheets
            .filter(({ sheetName }) => sheetName !== IAM_USER_SHEET)
            .map(({ title, sheetName, icon }) => (
              <ListItem
                button
                component={Link}
                key={sheetName}
                to={uiPaths.sheetPath({ sheetName })}
                selected={sheetName === currentSheet?.sheetName}
              >
                {icon && (
                  <ListItemIcon>
                    <Icon color="primary">{icon}</Icon>
                  </ListItemIcon>
                )}
                <ListItemText primary={title} />
              </ListItem>
            )),
        ])}
      </List>
      <Divider className={classes.divider} variant="middle" />
      <List>
        <ListSubheader>{l.listTitles.managementSheets}</ListSubheader>
        {iamSheet && (
          <ListItem
            button
            component={Link}
            key={iamSheet.sheetName}
            to={uiPaths.sheetPath({ sheetName: iamSheet.sheetName })}
            selected={iamSheet.sheetName === currentSheet?.sheetName}
          >
            <ListItemIcon>
              <Icon color="primary">people</Icon>
            </ListItemIcon>
            <ListItemText primary={iamSheet.title} />
          </ListItem>
        )}
      </List>

      <List className={classes.signOut}>
        <ListItem
          button
          component={Link}
          key="sign-out"
          to={uiPaths.signOutPath()}
          dense
        >
          <Typography variant="overline" color="textPrimary">
            {l.buttons.signOut}
          </Typography>
        </ListItem>
      </List>
    </Drawer>
  )
}
