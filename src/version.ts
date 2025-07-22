import './types/build.d.ts'

export function version (): void {
  console.log(__build__.VERSION)
}
