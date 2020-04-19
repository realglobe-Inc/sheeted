import React, { forwardRef } from 'react'
import AddBoxIcon from '@material-ui/icons/AddBox'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import CheckIcon from '@material-ui/icons/Check'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ClearIcon from '@material-ui/icons/Clear'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditIcon from '@material-ui/icons/Edit'
import FilterListIcon from '@material-ui/icons/FilterList'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import LastPageIcon from '@material-ui/icons/LastPage'
import RemoveIcon from '@material-ui/icons/Remove'
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import SearchIcon from '@material-ui/icons/Search'
import ViewColumnIcon from '@material-ui/icons/ViewColumn'
import { SvgIconProps } from '@material-ui/core'

export const tableIcons = {
  Add: forwardRef<any, SvgIconProps>(function AddBox(props: SvgIconProps, ref) {
    return <AddBoxIcon {...props} ref={ref} />
  }),
  Check: forwardRef<any, SvgIconProps>(function Check(props, ref) {
    return <CheckIcon {...props} ref={ref} />
  }),
  Clear: forwardRef<any, SvgIconProps>(function Clear(props, ref) {
    return <ClearIcon {...props} ref={ref} />
  }),
  Delete: forwardRef<any, SvgIconProps>(function DeleteOutline(props, ref) {
    return <DeleteOutlineIcon {...props} ref={ref} />
  }),
  DetailPanel: forwardRef<any, SvgIconProps>(function ChevronRight(props, ref) {
    return <ChevronRightIcon {...props} ref={ref} />
  }),
  Edit: forwardRef<any, SvgIconProps>(function Edit(props, ref) {
    return <EditIcon {...props} ref={ref} />
  }),
  Export: forwardRef<any, SvgIconProps>(function SaveAlt(props, ref) {
    return <SaveAltIcon {...props} ref={ref} />
  }),
  Filter: forwardRef<any, SvgIconProps>(function FilterList(props, ref) {
    return <FilterListIcon {...props} ref={ref} />
  }),
  FirstPage: forwardRef<any, SvgIconProps>(function FirstPage(props, ref) {
    return <FirstPageIcon {...props} ref={ref} />
  }),
  LastPage: forwardRef<any, SvgIconProps>(function LastPage(props, ref) {
    return <LastPageIcon {...props} ref={ref} />
  }),
  NextPage: forwardRef<any, SvgIconProps>(function ChevronRight(props, ref) {
    return <ChevronRightIcon {...props} ref={ref} />
  }),
  PreviousPage: forwardRef<any, SvgIconProps>(function ChevronLeft(props, ref) {
    return <ChevronLeftIcon {...props} ref={ref} />
  }),
  ResetSearch: forwardRef<any, SvgIconProps>(function Clear(props, ref) {
    return <ClearIcon {...props} ref={ref} />
  }),
  Search: forwardRef<any, SvgIconProps>(function Search(props, ref) {
    return <SearchIcon {...props} ref={ref} />
  }),
  SortArrow: forwardRef<any, SvgIconProps>(function ArrowDownward(props, ref) {
    return <ArrowDownwardIcon {...props} ref={ref} />
  }),
  ThirdStateCheck: forwardRef<any, SvgIconProps>(function Remove(props, ref) {
    return <RemoveIcon {...props} ref={ref} />
  }),
  ViewColumn: forwardRef<any, SvgIconProps>(function ViewColumn(props, ref) {
    return <ViewColumnIcon {...props} ref={ref} />
  }),
}
