import React from 'react'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom'
import MLink, { LinkProps as MLinkProps } from '@material-ui/core/Link'

export const Link = React.forwardRef(function Link(
  props: RouterLinkProps & MLinkProps,
  ref: any,
) {
  return <MLink component={RouterLink} underline="none" {...props} ref={ref} />
})
