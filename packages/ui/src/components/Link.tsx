import React, { FC } from 'react'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom'
import MLink, { LinkProps as MLinkProps } from '@material-ui/core/Link'

export const Link: FC<RouterLinkProps & MLinkProps> = React.forwardRef(
  function Link(props, ref) {
    return (
      <MLink component={RouterLink} underline="none" {...props} ref={ref} />
    )
  },
)
