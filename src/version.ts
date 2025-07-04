import process from "node:process"

export function version () {
  console.log(process.env.VERSION)
}
