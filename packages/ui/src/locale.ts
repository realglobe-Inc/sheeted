import { Localization } from 'material-table'

export const locale = {
  actions: {
    delete: '削除',
  },
  buttons: {
    ok: 'OK',
    cancel: 'キャンセル',
    deselect: '選択を解除',
    signIn: 'SIGN IN',
    signOut: 'SIGN OUT',
  },
  dialogs: {
    EntitySelectDialog: {
      title: (name: string) => `${name}を選択`,
    },
  },
  errors: {
    unexpectedError: '予期せぬエラーが発生しました',
  },
  links: {
    sheetHome: 'ホーム',
  },
  listTitles: {
    sheets: 'シート',
    managementSheets: '管理シート',
  },
  placeholders: {
    pleaseSelect: '[未選択]',
  },
  table: {
    permissionDenied: 'アクセス権限がありません',
    emptyList: 'データがありません',
  },
  snackbars: {
    createComplete: '作成しました',
    createFailed: '作成できませんでした',
    deleteComplete: '削除しました',
    deleteFailed: '削除できませんでした',
    editComplete: '保存しました',
    editFaield: '保存できませんでした',
    signInComplete: 'ログインしました',
    signInFailed: 'ログインに失敗しました',
    signOutComplete: 'ログアウトしました',
  },
} as const

export const tableLocalization: Localization = {
  body: {
    dateTimePickerLocalization: undefined,
    emptyDataSourceMessage: 'データがありません',
    filterRow: {
      filterTooltip: 'フィルター',
    },
    editRow: {
      saveTooltip: '保存',
      cancelTooltip: 'キャンセル',
      deleteText: '削除',
    },
    addTooltip: '追加',
    deleteTooltip: '削除',
    editTooltip: '編集',
  },
  header: {
    actions: 'アクション',
  },
  grouping: {
    groupedBy: 'グルーピング',
    placeholder: 'グルーピングしたいヘッダーをここにドラッグしてください',
  },
  pagination: {
    firstTooltip: '最初のページ',
    firstAriaLabel: '最初のページ',
    previousTooltip: '前のページ',
    previousAriaLabel: '前のページ',
    nextTooltip: '次のページ',
    nextAriaLabel: '次のページ',
    labelDisplayedRows: '{count}中 {from}-{to}',
    labelRowsPerPage: '1ページの行数:',
    lastTooltip: '最後のページ',
    lastAriaLabel: '最後のページ',
    labelRowsSelect: '行',
  },
  toolbar: {
    addRemoveColumns: '行を追加または削除',
    nRowsSelected: '{0}行を選択中',
    showColumnsTitle: '行を表示',
    showColumnsAriaLabel: '行を表示',
    exportTitle: 'エクスポート',
    exportAriaLabel: 'エクスポート',
    exportName: 'CSVファイルでエクスポート',
    searchTooltip: '検索',
    searchPlaceholder: '検索',
  },
}
