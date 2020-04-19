import React, { FC } from 'react'
import MLink, { LinkProps as MLinkProps } from '@material-ui/core/Link'

export const ExternalLink: FC<MLinkProps> = (props) => {
  return <MLink underline="none" {...props} />
}
