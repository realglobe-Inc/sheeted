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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ApiPathBuilder = (base?: string) => {
  const based = Based(base)
  return {
    currentUserPath: (): string => based(ApiPaths.CURRENT_USER),
    sheetsPath: (): string => based(ApiPaths.SHEETS),
    sheetOnePath: ({ sheetName }: SheetPathParams): string =>
      based(ApiPaths.SHEET_ONE.replace(':sheetName', sheetName)),
    actionOnePath: ({ sheetName, actionId }: ActionPathParams): string =>
      based(
        ApiPaths.ACTION_ONE.replace(':sheetName', sheetName).replace(
          ':actionId',
          actionId,
        ),
      ),
    entitiesPath: ({ sheetName }: SheetPathParams): string =>
      based(ApiPaths.ENTITIES.replace(':sheetName', sheetName)),
    entitiesDeletePath: ({ sheetName }: SheetPathParams): string =>
      based(ApiPaths.ENTITIES_DELETE.replace(':sheetName', sheetName)),
    entityOnePath: ({ sheetName, entityId }: EntityPathParams): string =>
      based(
        ApiPaths.ENTITY_ONE.replace(':sheetName', sheetName).replace(
          ':entityId',
          entityId,
        ),
      ),
    signInPath: (): string => based(ApiPaths.SIGN_IN),
    signInCallbackPath: (): string => based(ApiPaths.SIGN_IN_CALLBACK),
    signOutPath: (): string => based(ApiPaths.SIGN_OUT),
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const UIPathBuilder = (base?: string) => {
  const based = Based(base)
  return {
    homePath: (): string => based(UIPaths.HOME),
    signInPath: (): string => based(UIPaths.SIGN_IN),
    signInCallbackPath: (): string => based(UIPaths.SIGN_IN_CALLBACK),
    signOutPath: (): string => based(UIPaths.SIGN_OUT),
    sheetPath: ({ sheetName }: SheetPathParams): string =>
      based(UIPaths.SHEET.replace(':sheetName', sheetName)),
    sheetHomePath: (): string => based(UIPaths.SHEET_HOME),
    entityDetailPath: ({ sheetName, entityId }: EntityPathParams): string =>
      based(
        UIPaths.ENTITY_DETAIL.replace(':sheetName', sheetName).replace(
          ':entityId',
          entityId,
        ),
      ),
  }
}

export type ApiPathFuncs = ReturnType<typeof ApiPathBuilder>
export type UIPathFuncs = ReturnType<typeof UIPathBuilder>
