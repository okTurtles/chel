<template lang="pug">
.c-toolbar
  .c-flex-block
    button.is-icon.hide-tablet.c-nav-menu(v-if='!noNavigation' @click='$emit("open-nav")')
      i.icon-menu.c-btn-icon

    .c-app-title
      //- The Chelonia mark, in the text color so it follows the theme
      svg.c-logo(viewBox='0 0 64 64' aria-hidden='true' focusable='false')
        g(fill='currentColor' opacity='.55')
          path(d='M46.40 48.91 L39.45 52.92 L32.50 48.91 L32.50 40.89 L39.45 36.88 L46.40 40.89 Z')
          path(d='M31.50 48.91 L24.55 52.92 L17.60 48.91 L17.60 40.89 L24.55 36.88 L31.50 40.89 Z')
          path(d='M24.05 36.01 L17.10 40.02 L10.15 36.01 L10.15 27.99 L17.10 23.98 L24.05 27.99 Z')
          path(d='M31.50 23.11 L24.55 27.13 L17.60 23.11 L17.60 15.09 L24.55 11.08 L31.50 15.09 Z')
          path(d='M46.40 23.11 L39.45 27.12 L32.50 23.11 L32.50 15.09 L39.45 11.08 L46.40 15.09 Z')
        g(fill='currentColor' opacity='.22')
          path(d='M53.85 36.01 L46.90 40.02 L39.95 36.01 L39.95 27.99 L46.90 23.98 L53.85 27.99 Z')
          path(d='M38.95 36.01 L32.00 40.02 L25.05 36.01 L25.05 27.99 L32.00 23.98 L38.95 27.99 Z')
      i18n.is-title-3(tag='h1' @click='$router.push({ path: "/main" })') Chelonia

  .c-flex-block
    button.is-icon.c-theme-toggle(@click='toggleTheme')
      i(:class='`icon-${themeToggleIcon} c-btn-icon`')
</template>

<script>
import { mapState } from 'vuex'
import { THEME_LIGHT, THEME_DARK } from '@model/themes.js'

export default {
  name: 'Toolbar',
  props: {
    noNavigation: Boolean
  },
  computed: {
    ...mapState(['theme']),
    themeToggleIcon () {
      return this.theme === THEME_LIGHT ? 'moon' : 'sun'
    }
  },
  methods: {
    toggleTheme () {
      this.$store.commit('setTheme', this.theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT)
    }
  }
}
</script>

<style lang="scss" scoped>
@use "@assets/style/_variables.scss" as *;

.c-toolbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid $border;
  padding: 0 1rem;
  opacity: 0;
  animation: opacity-in 500ms ease-out forwards;
}

.c-flex-block {
  display: flex;
  align-items: center;
}

.c-app-title {
  h1 {
    display: inline-block;
    letter-spacing: 1px;
    cursor: pointer;
    @extend %unselectable;
  }

  .c-logo {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    margin-right: 0.25rem;
    vertical-align: middle;
    transform: translateY(-3px);
  }
}

.c-nav-menu {
  margin-right: 1rem;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 6px;
}

.c-btn-icon {
  display: inline-block;
  margin-top: 2px;
  font-size: 1.2rem;
}
</style>
