export function handleGlobalError(
  handler: (err: string | Event) => void,
): void {
  window.addEventListener('unhandledrejection', handler)
  const { onerror } = window
  window.onerror = (e) => {
    onerror && onerror(e)
    handler(e)
  }
}
