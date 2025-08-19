import { Vue } from '../../deps.ts'

// TypeScript interfaces for Vue directive
interface DirectiveBinding {
  arg?: string
  value?: {
    tag?: string
    attrs?: { [key: string]: string }
  }
}

interface VNode {
  context?: {
    $v: {
      form: {
        [key: string]: {
          $error: boolean
          $params: { [key: string]: unknown }
          [key: string]: unknown
        }
      }
    }
  }
}

// Register a global custom directive called `v-error`
// to automatically display vuelidate error messages
//
// Config:
//         validations: {
//           form: {
//             incomeAmount: {
//               [L('field is required')]: required,
//               [L('cannot be negative')]: v => v >= 0,
//               [L('cannot have more than 2 decimals')]: decimals(2)
//             },
//
// Markup:
//         i18n.label(tag='label') Enter your income:
//         input.input.is-primary(
//           type='text'
//           v-model='$v.form.incomeAmount.$model'
//           :class='{error: $v.form.incomeAmount.$error}'
//           v-error:incomeAmount='{ tag: "p", attrs: { "data-test": "badIncome" } }'
//         )

Vue.directive('error', {
  inserted (el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    if (!binding.arg) {
      throw new Error(`v-error: missing argument on ${el.outerHTML}`)
    }
    if (!vnode.context!.$v.form[binding.arg]) {
      throw new Error(`v-error: vuelidate doesn't have validation for ${binding.arg} on ${el.outerHTML}`)
    }
    const opts = binding.value || {}
    const pErr = document.createElement(opts.tag || 'span')
    for (const attr in opts.attrs) {
      pErr.setAttribute(attr, opts.attrs[attr])
    }
    pErr.classList.add('error', 'is-hidden')
    el.insertAdjacentElement('afterend', pErr)
  },
  update (el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    if (vnode.context!.$v.form[binding.arg!].$error) {
      for (const key in vnode.context!.$v.form[binding.arg!].$params) {
        if (!vnode.context!.$v.form[binding.arg!][key]) {
          (el.nextSibling as HTMLElement).innerText = key
          break
        }
      }
      (el.nextElementSibling as HTMLElement).classList.remove('is-hidden')
    } else {
      (el.nextElementSibling as HTMLElement).classList.add('is-hidden')
    }
  },
  unbind (el: HTMLElement) {
    (el.nextElementSibling as HTMLElement).remove()
  }
})
