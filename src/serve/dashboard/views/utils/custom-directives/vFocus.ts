import { Vue } from '~/deps.ts'

Vue.directive('focus', {
  inserted: (el, args) => {
    if (!args || args.value !== false) el.focus()
  }
})
