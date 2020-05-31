import { View } from '@sheeted/core'

import { Sheet1Entity } from './sheet1.entity'

export const Sheet1View: View<Sheet1Entity> = {
  title: 'シート1',
  display: (entity) => entity.name,
  enableDetail: true,
  columns: {
    name: {
      title: 'NAME',
    },
    integer: {
      title: 'INTEGER',
    },
    url: {
      title: 'URL',
      textOptions: {
        isLink: true,
      },
    },
    plan: {
      title: 'PLAN',
      enumLabels: {
        free: 'FREE',
        basic: 'BASIC',
      },
    },
    colors: {
      title: 'COLOR',
      enumLabels: {
        red: 'RED',
        green: 'GREEN',
        blue: 'BLUE',
        white: 'WHITE',
        black: 'BLACK',
      },
    },
  },
}
