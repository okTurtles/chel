'use strict'

export function version () {
  // @ts-ignore: "cannot find name 'process'"
  console.log(process.env.VERSION)
}
