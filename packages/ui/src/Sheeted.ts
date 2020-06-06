export type SheetedConfig = {
  apiUrl: string
  appTitle: string
}

export class SheetedNotConfiguredError extends Error {
  constructor() {
    super(
      'Sheeted is not configured. First you must configure by calling Sheeted.config()',
    )
  }
}

class SheetedGlobalConfig {
  configured = false
  appTitle = ''
  private _apiUrl = ''

  config({ apiUrl, appTitle }: SheetedConfig) {
    this.configured = true
    this._apiUrl = apiUrl
    this.appTitle = appTitle
  }

  get apiUrl() {
    if (this.configured) {
      return this._apiUrl
    } else {
      throw new SheetedNotConfiguredError()
    }
  }
}

export const Sheeted = new SheetedGlobalConfig()
