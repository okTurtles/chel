import { sbp, Vue, Vuex } from '../../../deps.ts'
import Colors, { THEME_LIGHT, storeThemeToLocalStorage } from './themes.ts'
import { cloneDeep } from '../common/cdLodash.ts'

Vue.use(Vuex)

const defaultTheme = THEME_LIGHT
const initialState = {
  theme: defaultTheme
}

const mutations = {
  setTheme (state: any, theme: any) {
    state.theme = theme
  }
}

const getters = {
  colors (state: any) {
    return (Colors as any)[state.theme]
  }
}

const actions = {}

const store = new Vuex.Store({
  state: cloneDeep(initialState),
  mutations,
  getters,
  actions
})

// watchers
store.watch(
  (state: any) => state.theme,
  (theme: any) => {
    document.documentElement.dataset.theme = theme
    storeThemeToLocalStorage(theme)
  }
)

sbp('sbp/selectors/register', {
  'state/vuex/state': () => store.state,
  'state/vuex/commit': (id: any, payload: any) => store.commit(id, payload),
  'state/vuex/getters': () => store.getters
})

export default store
