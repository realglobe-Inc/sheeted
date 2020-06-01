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
   * Text options (only valid for text type)
   */
  textOptions?: {
    isLink?: true
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
