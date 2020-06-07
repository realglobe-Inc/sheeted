export const assertPascalCase = (str: string) => {
  const isCamelCase = /^[A-Z][A-Za-z0-9]*$/.test(str)
  if (!isCamelCase) {
    throw new Error(
      `Entity name must be pascal case (such as "FooBar"), but "${str}" is not.`,
    )
  }
}
