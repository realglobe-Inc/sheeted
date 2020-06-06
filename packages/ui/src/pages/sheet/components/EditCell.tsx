import React, { useCallback } from 'react'
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
  KeyboardTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
  DatePickerView,
} from '@material-ui/pickers'
import DayjsUtils from '@date-io/dayjs'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { makeStyles } from '@material-ui/core/styles'

import { Entity } from '../../../types/Entity.type'
import { useInputErrorFromContext } from '../hooks/InputErrorContextHook'
import { useEntityDialogContext } from '../hooks/EntityDialogContextHook'
import { useLocale } from '../../../hooks/LocaleContextHook'

type DatePickerOptions = {
  format: string
  views?: DatePickerView[]
}

type CommonOptions = {
  autoFocus: boolean
}

const useStyles = makeStyles(() => ({
  datePicker: {
    display: 'inline-block',
    fontSize: 13,
    minWidth: '11em',
  },
  timePicker: {
    display: 'inline-block',
    fontSize: 13,
    minWidth: '8em',
  },
}))

const TextInputCell = (
  props: EditComponentProps<Entity> & CommonOptions & { multiline?: boolean },
) => {
  const { field, title } = props.columnDef
  const error = useInputErrorFromContext(field)
  return (
    <TextField
      type="text"
      autoFocus={props.autoFocus}
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

const NumberInputCell = (props: EditComponentProps<Entity> & CommonOptions) => {
  const { field, title } = props.columnDef
  const error = useInputErrorFromContext(field)
  return (
    <TextField
      type="number"
      autoFocus={props.autoFocus}
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
  props: EditComponentProps<Entity> &
    CommonOptions & {
      labels: { label: string; value: string }[]
    },
) => {
  const { field } = props.columnDef
  const error = useInputErrorFromContext(field)
  return (
    <FormControl error={Boolean(error)}>
      <Select
        autoFocus={props.autoFocus}
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
  props: EditComponentProps<Entity> &
    CommonOptions & {
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
        autoFocus={props.autoFocus}
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
  props: EditComponentProps<Entity> & CommonOptions & DatePickerOptions,
) => {
  const { field } = props.columnDef
  const error = useInputErrorFromContext(field)
  const value = props.value || null
  const l = useLocale()
  const classes = useStyles()
  const onChange = useCallback(
    (date: MaterialUiPickersDate) => {
      props.onChange(date?.format(props.format))
    },
    [props],
  )
  return (
    <span className={classes.datePicker}>
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <KeyboardDatePicker
          autoFocus={props.autoFocus}
          format={props.format}
          value={value}
          views={props.views}
          onChange={onChange}
          error={Boolean(error)}
          helperText={error}
          // Modal props
          autoOk
          clearable
          okLabel={l.buttons.ok}
          cancelLabel={l.buttons.cancel}
          clearLabel={l.buttons.clear}
        />
      </MuiPickersUtilsProvider>
    </span>
  )
}

const TimePickerCell = (
  props: EditComponentProps<Entity> & CommonOptions & DatePickerOptions,
) => {
  const { field } = props.columnDef
  const error = useInputErrorFromContext(field)
  const l = useLocale()
  const classes = useStyles()
  const onChange = useCallback(
    (_date: MaterialUiPickersDate, value?: string | null) => {
      props.onChange(value)
    },
    [props],
  )
  let value: dayjs.Dayjs | null = null
  const rawValue = props.value
  if (typeof rawValue === 'string') {
    const now = dayjs()
    const [hours, minutes] = (props.value as string).split(':').map(Number)
    value = now.hour(hours).minute(minutes)
  }
  return (
    <span className={classes.timePicker}>
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <KeyboardTimePicker
          autoFocus={props.autoFocus}
          format={props.format}
          value={value}
          onChange={onChange}
          error={Boolean(error)}
          helperText={error}
          ampm={false}
          // Modal props
          autoOk
          clearable
          okLabel={l.buttons.ok}
          cancelLabel={l.buttons.cancel}
          clearLabel={l.buttons.clear}
        />
      </MuiPickersUtilsProvider>
    </span>
  )
}

const EntitySelectCell = (
  props: EditComponentProps<Entity> &
    CommonOptions & {
      sheetName: string
    },
) => {
  const l = useLocale()
  const { sheetName, columnDef, onChange } = props
  const { field } = columnDef
  const error = useInputErrorFromContext(field)
  const entity: Partial<Entity> = props.value
  const { openDialog } = useEntityDialogContext()
  return (
    <TextField
      autoFocus={props.autoFocus}
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
  function EditCell(props: EditComponentProps<Entity>): JSX.Element {
    // 最初のカラムが readonly のときは無視されるが仕方ない
    const autoFocus = column.index === 0
    switch (column.form) {
      case 'text':
        return <TextInputCell autoFocus={autoFocus} {...props} />
      case 'text-multiline':
        return <TextInputCell autoFocus={autoFocus} {...props} multiline />
      case 'number':
        return <NumberInputCell autoFocus={autoFocus} {...props} />
      case 'select': {
        const { labels = [] } = column.custom.enum || {}
        return (
          <SelectInputCell autoFocus={autoFocus} {...props} labels={labels} />
        )
      }
      case 'select-multiple': {
        const { labels = [] } = column.custom.enum || {}
        return (
          <MultipleSelectInputCell
            autoFocus={autoFocus}
            {...props}
            labels={labels}
          />
        )
      }
      case 'entity':
        return (
          <EntitySelectCell
            autoFocus={autoFocus}
            {...props}
            {...(column.custom.entity || { sheetName: 'NotFound' })}
          />
        )
      case 'calendar': {
        const options: DatePickerOptions = column.formOptions
        return <DatePickerCell autoFocus={autoFocus} {...props} {...options} />
      }
      case 'time': {
        const options: DatePickerOptions = column.formOptions
        return <TimePickerCell autoFocus={autoFocus} {...props} {...options} />
      }
      default:
        return <TextInputCell autoFocus={autoFocus} {...props} />
    }
  }
