import { assertCamelCase } from './helpers'

export type GenerateSheetOptions = {
  entityName: string
}

export const generateSheet = async (
  distDir: string,
  { entityName }: GenerateSheetOptions,
): Promise<void> => {
  assertCamelCase(entityName)
  // TODO
  await Promise.resolve({ distDir, entityName })
}
