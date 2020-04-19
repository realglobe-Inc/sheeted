export type SheetedConfig = {
  apiUrl: string
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
  private _apiUrl = ''

  config({ apiUrl }: SheetedConfig) {
    this.configured = true
    this._apiUrl = apiUrl
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
