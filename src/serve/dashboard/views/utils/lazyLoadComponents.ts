import { Vue } from '../../../../deps.ts'
import LoadingPage from '@pages/miscellaneous/Loading.vue'
import ErrorPage from '@pages/miscellaneous/ErrorLoading.vue'

export function lazyComponent (name: string, lazyImport: () => Promise<any>): void {
  Vue.component(name, lazyImport)
  // TODO:
  // Create LoadingModal.vue & ErrorModal.vue and
  // expand this function to Vue.component(name, () => ({ component: ... , loading: ..., error: ... })) format.
}

/*
This method of loading components is documented here and is used to ensure compatibility
with lazy-loaded routes:
https://github.com/vuejs/vue-router/pull/2140/files#diff-7d999265ce5b22152fdffee108ca6385
*/
export function lazyPage (lazyImport: () => Promise<any>): () => Promise<any> {
  const handler = () => ({
    // HACK: sometimes a bundler bug makes it necessary to use
    // `.then(m => m.default ?? m)` when importing a module with `import()`.
    component: lazyImport().then((m: any) => m.default ?? m),
    loading: LoadingPage,
    error: ErrorPage
  })

  return () => Promise.resolve({
    functional: true,
    render (h: any, { data, children }: { data: any, children: any }) {
      return h(handler, data, children)
    }
  })
}

// register modals
lazyComponent('ViewContractManifestModal', () => import('../containers/modal/ViewContractManifestModal.vue'))
lazyComponent('Prompt', () => import('../containers/modal/Prompt.vue'))
