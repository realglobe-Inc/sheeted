import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { Column } from '@sheeted/core/build/web/Shared.type'

import { Entity } from '../../../types/Entity.type'
import { EntityFieldValueHoc } from '../../../hoc/EntityFieldValueHoc'

const useStyles = makeStyles({
  table: {
    maxWidth: 650,
  },
  fieldName: {
    color: '#666',
  },
})

export const EntityDetailTable: FC<{
  entity: Entity | null
  columns: Column[]
}> = ({ entity, columns }) => {
  const classes = useStyles()
  if (!entity) {
    return null
  }
  const rows = Object.entries(entity)
    .filter(
      ([field]) =>
        !field.startsWith('_') && !field.startsWith('$') && field !== 'id',
    )
    .map(([field, value]) => ({
      name: field,
      value,
      column: columns.find((c) => c.field === field),
    }))
  return (
    <Table className={classes.table}>
      <TableBody>
        {rows.map((row) => {
          const Value = row.column
            ? EntityFieldValueHoc(row.column)
            : () => null
          return (
            <TableRow key={row.name}>
              <TableCell className={classes.fieldName}>{row.name}</TableCell>
              <TableCell align="right">
                <Value entity={entity} />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
