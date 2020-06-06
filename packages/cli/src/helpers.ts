export const assertCamelCase = (str: string) => {
  const isCamelCase = /^[A-Z][A-Za-z0-9]/.test(str)
  if (!isCamelCase) {
    throw new Error(`Entity name must be camel case, but given "${str}"`)
  }
}
