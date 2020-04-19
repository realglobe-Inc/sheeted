export type Interceptor<Raw> = {
  stringify(raw: Raw): string
  parse(text: string): Raw
}
