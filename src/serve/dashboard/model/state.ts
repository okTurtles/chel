import sbp from 'npm:@sbp/sbp'
import { cloneDeep } from 'npm:turtledash'
import Vue from 'npm:vue'
import Vuex from 'npm:vuex'
import Colors, { storeThemeToLocalStorage, THEME_LIGHT } from './themes.ts'

Vue.use(Vuex)

const defaultTheme = THEME_LIGHT
const initialState: {
  theme: keyof typeof Colors
} = {
  theme: defaultTheme
}

const mutations = {
  setTheme (state: { theme: keyof typeof Colors }, theme: keyof typeof Colors) {
    state.theme = theme
  }
}

const getters = {
  colors (state: { theme: keyof typeof Colors }) {
    return Colors[state.theme]
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
