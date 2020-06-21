export type SheetedConfig = {
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
  private _appTitle = ''

  config({ appTitle }: SheetedConfig) {
    this.configured = true
    this._appTitle = appTitle
  }

  get appTitle() {
    if (this.configured) {
      return this._appTitle
    } else {
      throw new SheetedNotConfiguredError()
    }
  }
}

export const Sheeted = new SheetedGlobalConfig()
