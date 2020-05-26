export type SheetPathParams = {
  sheetName: string
}

export type EntityPathParams = {
  sheetName: string
  entityId: string
}

export type ActionPathParams = {
  sheetName: string
  actionId: string
}

export const ApiPaths = {
  CURRENT_USER: '/api/currentUser',
  SHEETS: '/api/sheets',
  SHEET_ONE: '/api/sheets/:sheetName',
  ACTION_ONE: '/api/sheets/:sheetName/actions/:actionId',
  ENTITIES: '/api/sheets/:sheetName/entities',
  ENTITIES_DELETE: '/api/sheets/:sheetName/entities/delete',
  ENTITY_ONE: '/api/sheets/:sheetName/entities/:entityId',
  SIGN_IN: '/api/sign/in',
  SIGN_IN_CALLBACK: '/api/sign/in/callback',
  SIGN_OUT: '/api/sign/out',
} as const

const Based = (base?: string) => {
  const basePath =
    base && base !== '/' ? '/' + base.replace(/^\//, '').replace(/\/$/, '') : ''
  return (path: string) => basePath + path
}

export const ApiPathBuilder = (base?: string) => {
  const based = Based(base)
  return {
    currentUserPath: () => based(ApiPaths.CURRENT_USER),
    sheetsPath: () => based(ApiPaths.SHEETS),
    sheetOnePath: ({ sheetName }: SheetPathParams) =>
      based(ApiPaths.SHEET_ONE.replace(':sheetName', sheetName)),
    actionOnePath: ({ sheetName, actionId }: ActionPathParams) =>
      based(
        ApiPaths.ACTION_ONE.replace(':sheetName', sheetName).replace(
          ':actionId',
          actionId,
        ),
      ),
    entitiesPath: ({ sheetName }: SheetPathParams) =>
      based(ApiPaths.ENTITIES.replace(':sheetName', sheetName)),
    entitiesDeletePath: ({ sheetName }: SheetPathParams) =>
      based(ApiPaths.ENTITIES_DELETE.replace(':sheetName', sheetName)),
    entityOnePath: ({ sheetName, entityId }: EntityPathParams) =>
      based(
        ApiPaths.ENTITY_ONE.replace(':sheetName', sheetName).replace(
          ':entityId',
          entityId,
        ),
      ),
    signInPath: () => based(ApiPaths.SIGN_IN),
    signInCallbackPath: () => based(ApiPaths.SIGN_IN_CALLBACK),
    signOutPath: () => based(ApiPaths.SIGN_OUT),
  }
}

export const UIPaths = {
  HOME: '/',
  SIGN_IN: '/sign/in',
  SIGN_IN_CALLBACK: '/sign/in/callback',
  SIGN_OUT: '/sign/out',
  SHEET: '/sheets/:sheetName',
  SHEET_HOME: '/sheets',
  ENTITY_DETAIL: '/sheets/:sheetName/entities/:entityId',
}

export const UIPathBuilder = (base?: string) => {
  const based = Based(base)
  return {
    homePath: () => based(UIPaths.HOME),
    signInPath: () => based(UIPaths.SIGN_IN),
    signInCallbackPath: () => based(UIPaths.SIGN_IN_CALLBACK),
    signOutPath: () => based(UIPaths.SIGN_OUT),
    sheetPath: ({ sheetName }: SheetPathParams) =>
      based(UIPaths.SHEET.replace(':sheetName', sheetName)),
    sheetHomePath: () => based(UIPaths.SHEET_HOME),
    entityDetailPath: () => based(UIPaths.ENTITY_DETAIL),
  }
}

export type ApiPathFuncs = ReturnType<typeof ApiPathBuilder>
export type UIPathFuncs = ReturnType<typeof UIPathBuilder>
