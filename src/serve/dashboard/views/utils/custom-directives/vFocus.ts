import Vue from 'npm:vue'

Vue.directive('focus', {
  inserted: (el: HTMLElement, args: { value?: boolean }) => {
    if (!args || args.value !== false) el.focus()
  }
})
