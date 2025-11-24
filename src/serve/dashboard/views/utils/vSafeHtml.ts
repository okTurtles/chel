import dompurify from 'npm:dompurify'
import { cloneDeep } from 'npm:turtledash'
import Vue from 'npm:vue'

// TypeScript interfaces for Vue directive
interface SafeHtmlBinding {
  arg?: string
  value: string
  oldValue?: string
}

interface DompurifyConfig {
  ALLOWED_ATTR: string[]
  ALLOWED_TAGS: string[]
  RETURN_DOM_FRAGMENT: boolean
}

const dompurifyDefaultConfig: DompurifyConfig = {
  ALLOWED_ATTR: ['class'],
  ALLOWED_TAGS: ['b', 'br', 'em', 'i', 'p', 'small', 'span', 'strong', 'sub', 'sup', 'u', 's', 'code', 'ul', 'li', 'pre', 'blockquote', 'del'],
  // This option was in the original file.
  RETURN_DOM_FRAGMENT: true
}

const sanitize = (el: HTMLElement, binding: SafeHtmlBinding) => {
  if (binding.oldValue !== binding.value) {
    let config = dompurifyDefaultConfig
    const allowedTagsAttrs: { [key: string]: string[] } = {
      'a': ['href', 'target'],
      'button': ['type']
    }

    if (Object.keys(allowedTagsAttrs).includes(binding.arg as string)) {
      config = cloneDeep(config)
      config.ALLOWED_TAGS.push(binding.arg as string)
      config.ALLOWED_ATTR.push(...(allowedTagsAttrs[binding.arg as string] || []))
    }

    el.textContent = ''
    el.appendChild(dompurify.sanitize(binding.value, config))
  }
}

Vue.directive('safe-html', {
  bind: sanitize,
  update: sanitize
})
