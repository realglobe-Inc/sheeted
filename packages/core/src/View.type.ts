import * as CSS from 'csstype'

import { Field } from './EntityBase.type'
import { SortQuery } from './Repository.type'

/**
 * Column view
 */
export type ColumnView<Field> = {
  /**
   * Field name. This is a key of the entity.
   */
  field: Field

  /**
   * Field title
   */
  title: string

  /**
   * Custom CSS style of the column
   */
  style?: CSS.Properties

  /**
   * Show field only on the detail page.
   * This option is valid only when the field is readonly.
   */
  detailPageOnly?: boolean

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

    /**
     * See number as Date and format with such as "YYYY-MM-DD HH:mm:ss" string.
     */
    formatAsDate?: string
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
   * Default sort
   */
  defaultSort?: SortQuery<Entity>

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
  columns: ColumnView<Field<Entity>>[]
}
