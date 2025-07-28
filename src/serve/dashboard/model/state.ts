import { sbp, Vue, Vuex } from '../../../deps.ts'
import Colors, { THEME_LIGHT, storeThemeToLocalStorage } from './themes.ts'
import { cloneDeep } from '../common/cdLodash.ts'

Vue.use(Vuex)

const defaultTheme = THEME_LIGHT
const initialState = {
  theme: defaultTheme
}

const mutations = {
  setTheme (state: { theme: string }, theme: string) {
    state.theme = theme
  }
}

const getters = {
  colors (state: { theme: string }) {
    return (Colors as Record<string, unknown>)[state.theme]
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
  (state: { theme: string }) => state.theme,
  (theme: string) => {
    document.documentElement.dataset.theme = theme
    storeThemeToLocalStorage(theme)
  }
)

sbp('sbp/selectors/register', {
  'state/vuex/state': () => store.state,
  'state/vuex/commit': (id: string, payload: unknown) => store.commit(id, payload),
  'state/vuex/getters': () => store.getters
})

export default store
