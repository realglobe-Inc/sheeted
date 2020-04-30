import {
  Sheet,
  RepositoryDriver,
  Repositories,
  Repository,
} from '@sheeted/core'

export const createRepositories = (
  sheets: Sheet[],
  RepositoryClass: RepositoryDriver,
) => {
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
  }
  return repositories
}
