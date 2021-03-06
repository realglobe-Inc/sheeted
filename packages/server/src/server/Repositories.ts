import {
  Sheet,
  RepositoryDriver,
  Repositories,
  Repository,
} from '@sheeted/core'

export const createRepositories = (
  sheets: Sheet[],
  RepositoryClass: RepositoryDriver,
): Repositories => {
  const map = new Map(
    sheets.map((sheet) => [
      sheet.name,
      new RepositoryClass(sheet.name, sheet.Schema),
    ]),
  )
  const repositories: Repositories = {
    get(sheetName: string): Repository<any> {
      return map.get(sheetName)!
    },
    async initialize(): Promise<void> {
      for (const repository of map.values()) {
        await repository.initialize()
      }
    },
  }
  return repositories
}
