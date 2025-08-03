import { sbp, Vue } from '~/deps.ts'
import '~/deps.ts' // For okturtles.data and okturtles.events side effects
import router from './controller/router.ts'
import store from './model/state.ts'
import { initTheme } from './model/themes.ts'
import './views/utils/vStyle.js'
import './views/utils/vError.js'
import './views/utils/vSafeHtml.js'
import './views/utils/ui.js'
import './controller/backend.js'
import '@common/translations.js'

// custom directive declarations
import './views/utils/custom-directives/index.js'

// register lazy components
import './views/utils/lazyLoadComponents.js'

// vue-components
import Modal from '@containers/modal/Modal.vue'
import Toolbar from '@containers/toolbar/Toolbar.vue'
import Navigation from '@containers/navigation/Navigation.vue'
import AppStyles from '@components/AppStyles.vue'

Vue.config.errorHandler = function (err: Error, vm: unknown, info: string) {
  console.error(`uncaught Vue error in ${info}: `, err)
}

async function startApp () {
  // deno-lint-ignore no-window
  sbp('okTurtles.data/set', 'API_URL', window.location.origin)
  await sbp('translations/init', 'en-US') // TODO!: switch back to navigator.language once the development is complete..!

  new Vue({
    router,
    store,
    components: {
      Toolbar,
      Navigation,
      AppStyles,
      Modal
    },
    data (): Record<string, unknown> {
      return {
        isNavOpen: false
      }
    },
    computed: {
      hideNavigation (): boolean {
        return ['DesignSystem', 'Landing'].includes((this as unknown as { $route: { name: string } }).$route.name)
      },
      hideToolbar (): boolean {
        return (this as unknown as { $route: { name: string } }).$route.name === 'Landing'
      }
    },
    methods: {
      openNav (): void {
        ((this as unknown as { $refs: { navigation: { open: () => void } } }).$refs.navigation.open())
      }
    },
    created (): void {
      initTheme()
    }
  }).$mount('#app')
}

startApp()
