export type Interceptor<Raw> = {
  stringify(raw: Raw): string
  parse(text: string): Raw
}

export class ParseFailedError extends Error {
  name = 'ParseFailedError'
}
