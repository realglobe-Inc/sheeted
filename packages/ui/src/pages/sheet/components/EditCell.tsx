import React from 'react'
import { Column as SColumn } from '@sheeted/core/build/web/Shared.type'
import { EditComponentProps } from 'material-table'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import dayjs from 'dayjs'
import {
  TimePicker,
  DatePicker,
  MuiPickersUtilsProvider,
  DatePickerView,
} from '@material-ui/pickers'
import DayjsUtils from '@date-io/dayjs'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'

import { Entity } from '../../../types/Entity.type'
import { useInputErrorFromContext } from '../hooks/InputErrorContextHook'
import { useEntityDialogContext } from '../hooks/EntityDialogContextHook'
import { useLocale } from '../../../hooks/LocaleContextHook'

type DatePickerOptions = {
  format: string
  views?: DatePickerView[]
}

const TextInputCell = (
  props: EditComponentProps<Entity> & { multiline?: boolean },
) => {
  const { field, title } = props.columnDef
  const error = useInputErrorFromContext(field)
  return (
    <TextField
      type="text"
      multiline={props.multiline}
      placeholder={title}
      value={props.value || ''}
      onChange={(event) => props.onChange(event.target.value)}
      error={Boolean(error)}
      helperText={error}
      InputProps={{
        style: {
          fontSize: 13,
        },
      }}
    />
  )
}

const NumberInputCell = (props: EditComponentProps<Entity>) => {
  const { field, title } = props.columnDef
  const error = useInputErrorFromContext(field)
  return (
    <TextField
      type="number"
      style={{ float: 'right' }}
      placeholder={title}
      value={props.value || ''}
      onChange={(event) => props.onChange(event.target.value)}
      error={Boolean(error)}
      helperText={error}
      InputProps={{
        style: {
          fontSize: 13,
        },
      }}
    />
  )
}

const SelectInputCell = (
  props: EditComponentProps<Entity> & {
    labels: { label: string; value: string }[]
  },
) => {
  const { field } = props.columnDef
  const error = useInputErrorFromContext(field)
  return (
    <FormControl error={Boolean(error)}>
      <Select
        value={props.value || ''}
        onChange={(event) => props.onChange(event.target.value)}
        error={Boolean(error)}
        style={{
          fontSize: 13,
        }}
      >
        {props.labels.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

const MultipleSelectInputCell = (
  props: EditComponentProps<Entity> & {
    labels: { label: string; value: string }[]
  },
) => {
  const { field } = props.columnDef
  const error = useInputErrorFromContext(field)
  const values = (props.value || []) as string[]
  const findLabel = (value: string) =>
    props.labels.find((label) => label.value === value)
  const renderValue = (selected: unknown) =>
    (selected as string[])
      .map((value) => findLabel(value)?.label || value)
      .join(', ')
  return (
    <FormControl error={Boolean(error)}>
      <Select
        value={values}
        onChange={(event) => props.onChange(event.target.value)}
        multiple
        renderValue={renderValue}
        error={Boolean(error)}
        style={{
          fontSize: 13,
        }}
      >
        {props.labels.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
            <Checkbox checked={values.includes(value)} />
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

const DatePickerCell = (
  props: EditComponentProps<Entity> & DatePickerOptions,
) => {
  const { field } = props.columnDef
  const error = useInputErrorFromContext(field)
  const value = props.value || null
  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <DatePicker
        format={props.format}
        value={value}
        views={props.views}
        onChange={(date) => props.onChange(date?.format(props.format))}
        error={Boolean(error)}
        helperText={error}
        TextFieldComponent={(props) => (
          <TextField
            {...props}
            InputProps={{
              style: {
                fontSize: 13,
              },
            }}
          />
        )}
      />
    </MuiPickersUtilsProvider>
  )
}

const TimePickerCell = (
  props: EditComponentProps<Entity> & DatePickerOptions,
) => {
  const { field } = props.columnDef
  const error = useInputErrorFromContext(field)
  let value: dayjs.Dayjs | null = null
  if (props.value) {
    const now = dayjs()
    const [hours, minutes] = props.value.split(':').map(Number)
    value = now.hour(hours).minute(minutes)
  }
  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <TimePicker
        format={props.format}
        value={value}
        onChange={(date) => {
          props.onChange(date?.format(props.format))
        }}
        error={Boolean(error)}
        helperText={error}
        TextFieldComponent={(props) => (
          <TextField
            {...props}
            InputProps={{
              style: {
                fontSize: 13,
              },
            }}
          />
        )}
      />
    </MuiPickersUtilsProvider>
  )
}

const EntitySelectCell = (
  props: EditComponentProps<Entity> & {
    sheetName: string
  },
) => {
  const l = useLocale()
  const { sheetName, columnDef, onChange } = props
  const { field } = columnDef
  const error = useInputErrorFromContext(field)
  const entity = props.value
  const { openDialog } = useEntityDialogContext()
  return (
    <TextField
      type="text"
      value={
        entity?.[ENTITY_META_FIELD]?.displayText || l.placeholders.pleaseSelect
      }
      error={Boolean(error)}
      helperText={error}
      onClick={() => openDialog({ sheetName, onSelect: onChange })}
      InputProps={{
        readOnly: true,
        style: {
          fontSize: 13,
          cursor: 'pointer',
        },
      }}
    />
  )
}

export const EditCellFor = (column: SColumn) =>
  function EditCell(props: EditComponentProps<Entity>) {
    switch (column.form) {
      case 'text':
        return <TextInputCell {...props} />
      case 'text-multiline':
        return <TextInputCell {...props} multiline />
      case 'number':
        return <NumberInputCell {...props} />
      case 'select': {
        const { labels = [] } = column.enumColumnProperties || {}
        return <SelectInputCell {...props} labels={labels} />
      }
      case 'select-multiple': {
        const { labels = [] } = column.enumColumnProperties || {}
        return <MultipleSelectInputCell {...props} labels={labels} />
      }
      case 'entity':
        return (
          <EntitySelectCell {...props} {...column.entityColumnProperties!} />
        )
      case 'calendar': {
        const options: DatePickerOptions = column.formOptions
        return <DatePickerCell {...props} {...options} />
      }
      case 'time': {
        const options: DatePickerOptions = column.formOptions
        return <TimePickerCell {...props} {...options} />
      }
      default:
        return <TextInputCell {...props} />
    }
  }
