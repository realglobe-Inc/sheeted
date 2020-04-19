import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import { Sheeted } from './Sheeted'

// Create global object
Object.assign(window, {
  Sheeted,
})

document.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.createElement('div')
  rootEl.id = 'root'
  document.body.appendChild(rootEl)
  ReactDOM.render(<App />, document.getElementById('root'))
})
