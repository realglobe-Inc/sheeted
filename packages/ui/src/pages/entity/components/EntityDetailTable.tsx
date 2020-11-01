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
  const publicColumns = columns.filter(
    ({ field }) =>
      !field.startsWith('_') && !field.startsWith('$') && field !== 'id',
  )
  return (
    <Table className={classes.table}>
      <TableBody>
        {publicColumns.map((column) => {
          const Value = EntityFieldValueHoc(column, { isDetail: true })
          return (
            <TableRow key={column.field}>
              <TableCell className={classes.fieldName}>
                {column.title}
              </TableCell>
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
