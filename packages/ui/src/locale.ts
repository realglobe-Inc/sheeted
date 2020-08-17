import { Localization } from 'material-table'
import { ValidationErrorTypes } from '@sheeted/core/build/web/Consts'

export const locale = {
  actions: {
    delete: '削除',
    filter: 'フィルター',
  },
  buttons: {
    ok: 'OK',
    cancel: 'キャンセル',
    clear: 'クリア',
    deselect: '選択を解除',
    signIn: 'SIGN IN',
    signOut: 'SIGN OUT',
  },
  columns: {
    detail: '詳細',
  },
  dialogs: {
    EntitySelectDialog: {
      title: (name: string): string => `${name}を選択`,
    },
    DeleteResultDialog: {
      title: '削除結果',
      reason: {
        restrict: '関連するデータがあるため削除できませんでした',
        permissionDenied: '削除する権限がありません',
        notFound: 'データがありません',
      },
      labels: {
        success: '成功',
        failure: '失敗',
      },
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
  prompts: {
    beforeLeaveOnEdit: 'ページを移動しますか？行った変更が保存されません。',
  },
  table: {
    permissionDenied: 'アクセス権限がありません',
    emptyList: 'データがありません',
  },
  titles: {
    error: 'エラー',
    sheetNotFound: 'シートが見つかりません',
  },
  snackbars: {
    actionComplete: '操作が完了しました',
    actionFailed: '操作が失敗しました',
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
  validationErrors: {
    [ValidationErrorTypes.DUPLICATE]: 'すでに存在しています',
    [ValidationErrorTypes.ENUM]: '不正な値です',
    [ValidationErrorTypes.READONLY]: '変更できません',
    [ValidationErrorTypes.REQUIRED]: '必須',
    [ValidationErrorTypes.VALUE_TYPE]: '不正な値です',
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
    actions: '編集',
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
