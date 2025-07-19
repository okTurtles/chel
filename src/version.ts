export function version(): void {
  // @ts-expect-error: __build__ is injected at build time
  console.log(__build__.VERSION)
}
