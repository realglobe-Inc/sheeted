export const locale = {
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
    pleaseSelect: '[選択]',
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
