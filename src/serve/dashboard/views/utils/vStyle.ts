import { Vue } from '../../deps.ts'
/*
* Style tag overload because Vue is trying to compile
* the content inside the tag otherwise
*/
Vue.component('v-style', {
  render: function (createElement: (tag: string, children?: unknown) => unknown) {
    return createElement('style', this.$slots.default)
  }
})
