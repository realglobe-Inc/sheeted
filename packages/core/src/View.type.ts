/**
 * Column view
 */
export type ColumnView = {
  /**
   * Field title
   */
  title: string

  /**
   * Enum label (only required for enum type)
   */
  enumLabels?: {
    [name: string]: string
  }

  /**
   * Options for text type
   */
  textOptions?: {
    isLink?: true
  }

  /**
   * Options for numeric type
   */
  numericOptions?: {
    /**
     * Format number with [Intl.NumberFormat](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
     */
    formatWithIntl?: {
      locales: string
      options: Intl.NumberFormatOptions
    }
  }
}

/**
 * View settings for a sheet
 */
export type View<Entity = any> = {
  /**
   * Sheet title
   */
  title: string

  /**
   * Icon name. Currently only supported icon is Material icon font.
   * See https://material.io/resources/icons/
   */
  icon?: string

  /**
   * Text to display entity
   */
  display: (entity: Entity) => string

  /**
   * Enable entity detail page
   */
  enableDetail?: boolean

  /**
   * Column views
   */
  columns: {
    [P in keyof Entity]?: ColumnView
  }
}
