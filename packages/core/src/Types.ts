import { Type } from './Type.type'
import {
  CalendarDateInterceptor,
  TimeInterceptor,
  CALENDAR_DATE_FORMAT,
  CALENDAR_YEAR_FORMAT,
  CALENDAR_MONTH_FORMAT,
  TIME_FORMAT,
  CalendarYearInterceptor,
  CalendarMonthInterceptor,
} from './interceptors'

const Text: Type<string> = {
  rawType: 'text',
  form: 'text',
}

const LongText: Type<string> = {
  rawType: 'text',
  form: 'text-multiline',
}

const Numeric: Type<number> = {
  rawType: 'number',
  form: 'number',
}

const CalendarDate: Type<number> = {
  rawType: 'number',
  form: 'calendar',
  formOptions: {
    format: CALENDAR_DATE_FORMAT,
  },
  interceptor: CalendarDateInterceptor,
}

const CalendarMonth: Type<number> = {
  rawType: 'number',
  form: 'calendar',
  formOptions: {
    format: CALENDAR_MONTH_FORMAT,
    views: ['year', 'month'],
  },
  interceptor: CalendarMonthInterceptor,
}

const CalendarYear: Type<number> = {
  rawType: 'number',
  form: 'calendar',
  formOptions: {
    format: CALENDAR_YEAR_FORMAT,
    views: ['year'],
  },
  interceptor: CalendarYearInterceptor,
}

const Time: Type<number> = {
  rawType: 'number',
  form: 'time',
  formOptions: {
    format: TIME_FORMAT,
  },
  interceptor: TimeInterceptor,
}

const Enum: Type<any> = {
  rawType: 'text',
  form: 'select',
}

const EnumList: Type<any> = {
  rawType: 'text_list',
  form: 'select-multiple',
}

const Entity: Type<any> = {
  rawType: 'entity',
  form: 'entity',
}

export const Types = {
  Text,
  LongText,
  Numeric,
  CalendarDate,
  CalendarMonth,
  CalendarYear,
  Time,
  Enum,
  EnumList,
  Entity,
}
