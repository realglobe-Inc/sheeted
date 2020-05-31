import React from 'react'
import Dialog from '@material-ui/core/Dialog'

import { ErrorAlert } from './ErrorAlert'

export class TopErrorBoundary extends React.Component<
  {},
  { error: Error | null }
> {
  constructor(props: {}) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      const { error } = this.state
      return (
        <Dialog open>
          <ErrorAlert message={error.message} />
        </Dialog>
      )
    }

    return this.props.children
  }
}
