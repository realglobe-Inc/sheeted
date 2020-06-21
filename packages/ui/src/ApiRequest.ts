import qs from 'qs'
import { IAMUserEntity } from '@sheeted/core'
import { ApiPathBuilder, ApiPathFuncs } from '@sheeted/core/build/web/Paths'
import {
  Sheets,
  SheetInfo,
  ListQuery,
  ListResult,
} from '@sheeted/core/build/web/Shared.type'
import { HttpError } from '@sheeted/core/build/web/Errors'

import { Entity } from './types/Entity.type'
import { bind } from './utils/ObjectUtil'

// TODO: server 側と共通化
type ErrorResponse = {
  error: {
    message: string
  }
  errors?: {
    message: string
    field: string
  }[]
}

export class ApiRequest {
  token = ''
  apiPaths: ApiPathFuncs

  constructor() {
    this.apiPaths = ApiPathBuilder()
    bind(this)
  }

  async fetchCurrentUser(): Promise<IAMUserEntity | null> {
    const resp = await this.fetch(this.apiPaths.currentUserPath())
    const { user } = await resp.json()
    return user ? (user as IAMUserEntity) : null
  }

  async fetchSheets(): Promise<Sheets> {
    const resp = await this.fetch(this.apiPaths.sheetsPath())
    if (!resp.ok) {
      const { error }: ErrorResponse = await resp.json()
      throw new HttpError(error.message, resp.status)
    }
    const sheets: Sheets = await resp.json()
    return sheets
  }

  async fetchSheetInfo(sheetName: string): Promise<SheetInfo> {
    const resp = await this.fetch(this.apiPaths.sheetOnePath({ sheetName }))
    if (!resp.ok) {
      const { error }: ErrorResponse = await resp.json()
      throw new HttpError(error.message, resp.status)
    }
    const info: SheetInfo = await resp.json()
    return info
  }

  async fetchEntities(
    sheetName: string,
    query: ListQuery,
  ): Promise<ListResult> {
    const resp = await this.fetch(
      this.apiPaths.entitiesPath({ sheetName }) + '?' + qs.stringify(query),
    )
    if (!resp.ok) {
      const { error }: ErrorResponse = await resp.json()
      throw new HttpError(error.message, resp.status)
    }
    const result: ListResult = await resp.json()
    return result
  }

  async fetchEntity(sheetName: string, entityId: string): Promise<Entity> {
    const resp = await this.fetch(
      this.apiPaths.entityOnePath({ sheetName, entityId }),
    )
    if (!resp.ok) {
      const { error }: ErrorResponse = await resp.json()
      throw new HttpError(error.message, resp.status)
    }
    const entity: Entity = await resp.json()
    return entity
  }

  async createEntity(sheetName: string, entity: unknown): Promise<Entity> {
    const resp = await this.fetch(this.apiPaths.entitiesPath({ sheetName }), {
      method: 'POST',
      body: JSON.stringify(entity),
    })
    if (!resp.ok) {
      const { error, errors }: ErrorResponse = await resp.json()
      if (errors) {
        // validation errors
        const err = new Error()
        Object.assign(err, { errors })
        throw err
      } else {
        throw new HttpError(error.message, resp.status)
      }
    }
    const result: Entity = await resp.json()
    return result
  }

  async updateEntity(
    sheetName: string,
    entityId: string,
    changes: unknown,
  ): Promise<Entity> {
    const resp = await this.fetch(
      this.apiPaths.entityOnePath({ sheetName, entityId }),
      {
        method: 'POST',
        body: JSON.stringify(changes),
      },
    )
    if (!resp.ok) {
      const { error, errors }: ErrorResponse = await resp.json()
      if (errors) {
        // validation errors
        const err = new Error()
        Object.assign(err, { errors })
        throw err
      } else {
        throw new HttpError(error.message, resp.status)
      }
    }
    const result: Entity = await resp.json()
    return result
  }

  async deleteEntities(sheetName: string, entityIds: string[]): Promise<void> {
    const resp = await this.fetch(
      this.apiPaths.entitiesDeletePath({ sheetName }),
      {
        method: 'POST',
        body: JSON.stringify({ ids: entityIds }),
      },
    )
    if (!resp.ok) {
      const { error }: ErrorResponse = await resp.json()
      throw new HttpError(error.message, resp.status)
    }
  }

  async performAction(
    sheetName: string,
    actionId: string,
    entityIds: string[],
  ): Promise<void> {
    const resp = await this.fetch(
      this.apiPaths.actionOnePath({ sheetName, actionId }),
      {
        method: 'POST',
        body: JSON.stringify({ ids: entityIds }),
      },
    )
    if (!resp.ok) {
      const { error }: ErrorResponse = await resp.json()
      throw new HttpError(error.message, resp.status)
    }
  }

  private async fetch(path: string, init: RequestInit = {}) {
    return window.fetch(path, {
      headers: {
        ...this.headers,
        ...(init.headers || {}),
      },
      ...init,
    })
  }

  private get headers() {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    }
  }
}
