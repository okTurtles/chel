export function version () {
  // @ts-ignore: __build__ is injected at build time
  console.log(__build__.VERSION)
}
