export const assertProjectName = (name: string): void => {
  const pattern = '^[a-z0-9._-]+$'
  const valid = new RegExp(pattern).test(name)
  if (!valid) {
    throw new Error(
      `Invalid project name "${name}". Acceptable pattern is \`${pattern}\``,
    )
  }
}
