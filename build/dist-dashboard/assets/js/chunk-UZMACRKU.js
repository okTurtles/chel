import {
  CLOSE_MODAL,
  CLOSE_PROMPT,
  PROMPT_RESPONSE
} from "./chunk-JAZDRYJA.js";
import {
  esm_default
} from "./chunk-UHFMZPCY.js";

// src/serve/dashboard/views/utils/constants.ts
var PROMPT_ACTIONS = {
  PRIMARY: "prompt-action-primary",
  SECONDARY: "prompt-action-secondary",
  CLOSE: "prompt-action-close"
};

// src/serve/dashboard/views/containers/modal/ModalSimpleTemplate.vue
var __vue_script__ = {
  name: "ModalSimpleTemplate",
  data() {
    return {
      isActive: true
    };
  },
  props: {
    hideCloseButton: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      validator: (v) => ["prompt", "modal"].includes(v),
      default: "modal"
    }
  },
  methods: {
    close(cb = null) {
      if (!this.isActive) {
        return;
      }
      this.isActive = false;
      setTimeout(() => {
        if (cb) {
          return cb();
        }
        switch (this.variant) {
          case "modal":
            esm_default("okTurtles.events/emit", CLOSE_MODAL);
            break;
          case "prompt":
            esm_default("okTurtles.events/emit", PROMPT_RESPONSE, PROMPT_ACTIONS.CLOSE);
            esm_default("okTurtles.events/emit", CLOSE_PROMPT);
        }
      }, 300);
    }
  }
};
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "c-modal-simple", attrs: { role: "dialog" } },
    [
      _c("transition", { attrs: { name: "fade", appear: "appear" } }, [
        _vm.isActive ? _c("div", {
          staticClass: "c-modal-simple-background",
          on: {
            click: function($event) {
              return _vm.close();
            }
          }
        }) : _vm._e()
      ]),
      _c("transition", { attrs: { name: "zoom", appear: "appear" } }, [
        _vm.isActive ? _c("div", { staticClass: "c-modal-simple-content" }, [
          !_vm.hideCloseButton ? _c(
            "button",
            {
              staticClass: "is-icon c-close-btn",
              on: {
                click: function($event) {
                  return _vm.close();
                }
              }
            },
            [_c("i", { staticClass: "icon-close" })]
          ) : _vm._e(),
          _c(
            "section",
            { staticClass: "c-modal-simple-body" },
            [_vm._t("default")],
            2
          )
        ]) : _vm._e()
      ])
    ],
    1
  );
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
var __vue_inject_styles__ = function(inject) {
  if (!inject) return;
  inject("data-v-a24e0254_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-a24e0254]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-a24e0254] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-modal-simple[data-v-a24e0254] {\n  display: flex;\n  position: fixed;\n  z-index: 60;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  justify-content: center;\n  align-items: center;\n  max-width: 100vw;\n  overflow: hidden;\n}\n.c-modal-simple-background[data-v-a24e0254] {\n  position: fixed;\n  display: block;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(10, 10, 10, 0.86);\n}\n.c-modal-simple-content[data-v-a24e0254] {\n  position: relative;\n  display: block;\n  padding: 1.2rem 2rem;\n  width: 38rem;\n  max-width: calc(100vw - 2rem);\n  height: auto;\n  max-height: calc(100% - 4rem);\n  overflow: hidden;\n  background: var(--modal-bg-color);\n  border-radius: 0.375rem;\n}\n@media screen and (min-width: 769px), print {\n.c-modal-simple-content[data-v-a24e0254] {\n    padding: 2rem 3.2rem;\n}\n}\n@media screen and (min-width: 1200px) {\n.c-modal-simple-content[data-v-a24e0254] {\n    max-width: 46rem;\n}\n}\n.c-modal-simple-header[data-v-a24e0254] {\n  position: relative;\n  display: flex;\n}\n.c-close-btn[data-v-a24e0254] {\n  position: absolute;\n  right: 0.75rem;\n  top: 0.75rem;\n  width: 1.75rem;\n  height: 1.75rem;\n  border-radius: 50%;\n  z-index: 1;\n  background: var(--modal-bg-color);\n}\n.c-close-btn i[data-v-a24e0254] {\n  display: inline-block;\n  line-height: 1;\n  transform: translate(1px, 1px);\n  font-size: 1rem;\n}\n@media screen and (min-width: 769px), print {\n.c-close-btn[data-v-a24e0254] {\n    right: 1rem;\n    top: 1rem;\n    width: 2rem;\n    height: 2rem;\n}\n.c-close-btn i[data-v-a24e0254] {\n    font-size: 1.125rem;\n}\n}\n\n/*# sourceMappingURL=ModalSimpleTemplate.vue.map */", map: { "version": 3, "sources": ["ModalSimpleTemplate.vue", "src/serve/dashboard/views/containers/modal/ModalSimpleTemplate.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AC6GtB,qBAAA;AAGA;EAIA,kCAAA;EAAA,iCAAA;EAAA,2CAAA;EAAA,iDAAA;EAAA,oCAAA;EAAA,sDAAA;EAAA,+CAAA;EAAA,qDAAA;EAAA,qCAAA;EAAA,4DAAA;EAAA,sDAAA;EAAA,mCAAA;EAAA,8CAAA;EAAA,0CAAA;EAAA,+BAAA;EAAA,gDAAA;EAAA,sDAAA;EAAA,4CAAA;EAAA,wCAAA;EAAA,iCAAA;EAAA,4BAAA;EAAA,mCAAA;EAAA,wDAAA;EAAA,6BAAA;EAAA,8BAAA;EAAA,gCAAA;EAAA,6CAAA;EAAA,sBAAA;EAAA,qCAAA;EAAA,0BAAA;EAAA,kCAAA;EAAA,6CAAA;EAAA,mCAAA;EAAA,qCAAA;EAAA,uCAAA;EAAA,+DAAA;EAAA,2CAAA;EAAA,0BAAA;EAAA,2HAAA;EAAA,qCAAA;EAAA,iBAAA;EAAA,+BAAA;ADvEA;AC4EA;EAIA,kCAAA;EAAA,oCAAA;EAAA,2CAAA;EAAA,8CAAA;EAAA,iCAAA;EAAA,uDAAA;EAAA,4CAAA;EAAA,kDAAA;EAAA,wCAAA;EAAA,iDAAA;EAAA,4DAAA;EAAA,mCAAA;EAAA,sDAAA;EAAA,0CAAA;EAAA,+BAAA;EAAA,6CAAA;EAAA,mDAAA;EAAA,iCAAA;EAAA,wCAAA;EAAA,iCAAA;EAAA,4BAAA;EAAA,mCAAA;EAAA,+CAAA;EAAA,gCAAA;EAAA,8BAAA;EAAA,gCAAA;EAAA,0CAAA;EAAA,yBAAA;EAAA,yCAAA;EAAA,+CAAA;EAAA,kCAAA;EAAA,+BAAA;EAAA,mCAAA;EAAA,qCAAA;EAAA,uCAAA;EAAA,mDAAA;EAAA,8CAAA;EAAA,6BAAA;EAAA,sIAAA;EAAA,0BAAA;EAAA,iBAAA;EAAA,uCAAA;ADnCA;AC7BA;EACA,aAAA;EACA,eAAA;EACA,WAAA;EACA,OAAA;EACA,QAAA;EACA,MAAA;EACA,SAAA;EACA,uBAAA;EACA,mBAAA;EACA,gBAAA;EACA,gBAAA;ADgCA;AC9BA;EACA,eAAA;EACA,cAAA;EACA,MAAA;EACA,SAAA;EACA,OAAA;EACA,QAAA;EACA,wCAAA;ADgCA;AC7BA;EACA,kBAAA;EACA,cAAA;EACA,oBAAA;EACA,YAAA;EACA,6BAAA;EACA,YAAA;EACA,6BAAA;EACA,gBAAA;EACA,iCAAA;EACA,uBAAA;AD+BA;AChEA;AAuBA;IAaA,oBAAA;ADgCE;AACF;AACA;AC/CA;IAiBA,gBAAA;ADiCE;AACF;AC9BA;EACA,kBAAA;EACA,aAAA;ADgCA;AC5BA;EACA,kBAAA;EACA,cAAA;EACA,YAAA;EACA,cAAA;EACA,eAAA;EACA,kBAAA;EACA,UAAA;EACA,iCAAA;AD+BA;AC7BA;EACA,qBAAA;EACA,cAAA;EACA,8BAAA;EACA,eAAA;AD+BA;AC/FA;AAkDA;IAkBA,WAAA;IACA,SAAA;IACA,WAAA;IACA,YAAA;AD+BE;AC7BF;IACA,mBAAA;AD+BE;AACF;;AAEA,kDAAkD", "file": "ModalSimpleTemplate.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-modal-simple {\n  display: flex;\n  position: fixed;\n  z-index: 60;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  justify-content: center;\n  align-items: center;\n  max-width: 100vw;\n  overflow: hidden;\n}\n.c-modal-simple-background {\n  position: fixed;\n  display: block;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(10, 10, 10, 0.86);\n}\n.c-modal-simple-content {\n  position: relative;\n  display: block;\n  padding: 1.2rem 2rem;\n  width: 38rem;\n  max-width: calc(100vw - 2rem);\n  height: auto;\n  max-height: calc(100% - 4rem);\n  overflow: hidden;\n  background: var(--modal-bg-color);\n  border-radius: 0.375rem;\n}\n@media screen and (min-width: 769px), print {\n  .c-modal-simple-content {\n    padding: 2rem 3.2rem;\n  }\n}\n@media screen and (min-width: 1200px) {\n  .c-modal-simple-content {\n    max-width: 46rem;\n  }\n}\n.c-modal-simple-header {\n  position: relative;\n  display: flex;\n}\n\n.c-close-btn {\n  position: absolute;\n  right: 0.75rem;\n  top: 0.75rem;\n  width: 1.75rem;\n  height: 1.75rem;\n  border-radius: 50%;\n  z-index: 1;\n  background: var(--modal-bg-color);\n}\n.c-close-btn i {\n  display: inline-block;\n  line-height: 1;\n  transform: translate(1px, 1px);\n  font-size: 1rem;\n}\n@media screen and (min-width: 769px), print {\n  .c-close-btn {\n    right: 1rem;\n    top: 1rem;\n    width: 2rem;\n    height: 2rem;\n  }\n  .c-close-btn i {\n    font-size: 1.125rem;\n  }\n}\n\n/*# sourceMappingURL=ModalSimpleTemplate.vue.map */", `<template lang='pug'>
.c-modal-simple(role='dialog')
  transition(name='fade' appear)
    .c-modal-simple-background(v-if='isActive' @click='close()')

  transition(name='zoom' appear)
    .c-modal-simple-content(v-if='isActive')
      button.is-icon.c-close-btn(v-if='!hideCloseButton' @click='close()')
        i.icon-close

      section.c-modal-simple-body
        slot
</template>

<script>
import sbp from '@sbp/sbp'
import { CLOSE_MODAL, CLOSE_PROMPT, PROMPT_RESPONSE } from '../../../../../../src/serve/dashboard/views/utils/events.js'
import { PROMPT_ACTIONS } from '../../../../../../src/serve/dashboard/views/utils/constants.js'

export default {
  name: 'ModalSimpleTemplate',
  data () {
    return {
      isActive: true
    }
  },
  props: {
    hideCloseButton: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      validator: v => ['prompt', 'modal'].includes(v),
      default: 'modal'
    }
  },
  methods: {
    close (cb = null) {
      if (!this.isActive) { return }

      this.isActive = false
      setTimeout(() => {
        if (cb) { return cb() }

        switch (this.variant) {
          case 'modal':
            sbp('okTurtles.events/emit', CLOSE_MODAL)
            break
          case 'prompt':
            sbp('okTurtles.events/emit', PROMPT_RESPONSE, PROMPT_ACTIONS.CLOSE)
            sbp('okTurtles.events/emit', CLOSE_PROMPT)
        }
      }, 300)
    }
  }
}
<\/script>

<style style lang='scss' scoped>
@use "../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-modal-simple {
  display: flex;
  position: fixed;
  z-index: $zindex-modal;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  max-width: 100vw;
  overflow: hidden;

  &-background {
    position: fixed;
    display: block;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(10, 10, 10, 0.86);
  }

  &-content {
    position: relative;
    display: block;
    padding: 1.2rem 2rem;
    width: 38rem;
    max-width: calc(100vw - 2rem);
    height: auto;
    max-height: calc(100% - 4rem);
    overflow: hidden;
    background: var(--modal-bg-color);
    border-radius: 0.375rem;

    @include tablet {
      padding: 2rem 3.2rem;
    }

    @include desktop {
      max-width: 46rem;
    }
  }

  &-header {
    position: relative;
    display: flex;
  }
}

.c-close-btn {
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  z-index: 1;
  background: var(--modal-bg-color);

  i {
    display: inline-block;
    line-height: 1;
    transform: translate(1px, 1px);
    font-size: 1rem;
  }

  @include tablet {
    right: 1rem;
    top: 1rem;
    width: 2rem;
    height: 2rem;

    i {
      font-size: 1.125rem;
    }
  }
}
</style>
`] }, media: void 0 });
};
var __vue_scope_id__ = "data-v-a24e0254";
var __vue_module_identifier__ = void 0;
var __vue_is_functional_template__ = false;
function __vue_normalize__(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang='pug'>
.c-modal-simple(role='dialog')
  transition(name='fade' appear)
    .c-modal-simple-background(v-if='isActive' @click='close()')

  transition(name='zoom' appear)
    .c-modal-simple-content(v-if='isActive')
      button.is-icon.c-close-btn(v-if='!hideCloseButton' @click='close()')
        i.icon-close

      section.c-modal-simple-body
        slot
</template>

<script>
import sbp from '@sbp/sbp'
import { CLOSE_MODAL, CLOSE_PROMPT, PROMPT_RESPONSE } from '../../../../../../src/serve/dashboard/views/utils/events.js'
import { PROMPT_ACTIONS } from '../../../../../../src/serve/dashboard/views/utils/constants.js'

export default {
  name: 'ModalSimpleTemplate',
  data () {
    return {
      isActive: true
    }
  },
  props: {
    hideCloseButton: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      validator: v => ['prompt', 'modal'].includes(v),
      default: 'modal'
    }
  },
  methods: {
    close (cb = null) {
      if (!this.isActive) { return }

      this.isActive = false
      setTimeout(() => {
        if (cb) { return cb() }

        switch (this.variant) {
          case 'modal':
            sbp('okTurtles.events/emit', CLOSE_MODAL)
            break
          case 'prompt':
            sbp('okTurtles.events/emit', PROMPT_RESPONSE, PROMPT_ACTIONS.CLOSE)
            sbp('okTurtles.events/emit', CLOSE_PROMPT)
        }
      }, 300)
    }
  }
}
<\/script>

<style style lang='scss' scoped>
@use "../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-modal-simple {
  display: flex;
  position: fixed;
  z-index: $zindex-modal;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  max-width: 100vw;
  overflow: hidden;

  &-background {
    position: fixed;
    display: block;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(10, 10, 10, 0.86);
  }

  &-content {
    position: relative;
    display: block;
    padding: 1.2rem 2rem;
    width: 38rem;
    max-width: calc(100vw - 2rem);
    height: auto;
    max-height: calc(100% - 4rem);
    overflow: hidden;
    background: var(--modal-bg-color);
    border-radius: 0.375rem;

    @include tablet {
      padding: 2rem 3.2rem;
    }

    @include desktop {
      max-width: 46rem;
    }
  }

  &-header {
    position: relative;
    display: flex;
  }
}

.c-close-btn {
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  z-index: 1;
  background: var(--modal-bg-color);

  i {
    display: inline-block;
    line-height: 1;
    transform: translate(1px, 1px);
    font-size: 1rem;
  }

  @include tablet {
    right: 1rem;
    top: 1rem;
    width: 2rem;
    height: 2rem;

    i {
      font-size: 1.125rem;
    }
  }
}
</style>
`;
  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }
  component._scopeId = scope;
  if (true) {
    let hook;
    if (false) {
      hook = function(context) {
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
        if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
          context = __VUE_SSR_CONTEXT__;
        }
        if (style) {
          style.call(this, createInjectorSSR(context));
        }
        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      };
      component._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function(context) {
        style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
      } : function(context) {
        style.call(this, createInjector(context));
      };
    }
    if (hook !== void 0) {
      if (component.functional) {
        const originalRender = component.render;
        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        const existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }
  return component;
}
function __vue_create_injector__() {
  const styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
  const isOldIE = typeof navigator !== "undefined" && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return;
    const group = isOldIE ? css.media || "default" : id;
    const style = styles[group] || (styles[group] = { ids: [], parts: [], element: void 0 });
    if (!style.ids.includes(id)) {
      let code = css.source;
      let index = style.ids.length;
      style.ids.push(id);
      if (false) {
        code += "\n/*# sourceURL=" + css.map.sources[0] + " */";
        code += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + " */";
      }
      if (isOldIE) {
        style.element = style.element || document.querySelector("style[data-group=" + group + "]");
      }
      if (!style.element) {
        const head = document.head || document.getElementsByTagName("head")[0];
        const el = style.element = document.createElement("style");
        el.type = "text/css";
        if (css.media) el.setAttribute("media", css.media);
        if (isOldIE) {
          el.setAttribute("data-group", group);
          el.setAttribute("data-next-index", "0");
        }
        head.appendChild(el);
      }
      if (isOldIE) {
        index = parseInt(style.element.getAttribute("data-next-index"));
        style.element.setAttribute("data-next-index", index + 1);
      }
      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join("\n");
      } else {
        const textNode = document.createTextNode(code);
        const nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
        else style.element.appendChild(textNode);
      }
    }
  };
}
var __vue_component__ = /* @__PURE__ */ __vue_normalize__(
  { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
  __vue_inject_styles__,
  __vue_script__,
  __vue_scope_id__,
  __vue_is_functional_template__,
  __vue_module_identifier__,
  false,
  __vue_create_injector__,
  void 0,
  void 0
);
var ModalSimpleTemplate_default = __vue_component__;

// src/serve/dashboard/views/containers/modal/Prompt.vue
var __vue_script__2 = {
  name: "Prompt",
  components: {
    ModalSimpleTemplate: ModalSimpleTemplate_default
  },
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    primaryButton: {
      type: String,
      required: false
    },
    secondaryButton: {
      type: String,
      required: false
    },
    hideCloseButton: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onCtaClick(type = "") {
      const promptAction = {
        "primary": PROMPT_ACTIONS.PRIMARY,
        "secondary": PROMPT_ACTIONS.SECONDARY
      }[type];
      this.$refs.modal.close(() => {
        esm_default("okTurtles.events/emit", PROMPT_RESPONSE, promptAction);
        esm_default("okTurtles.events/emit", CLOSE_PROMPT);
      });
    }
  }
};
var __vue_render__2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "ModalSimpleTemplate",
    {
      ref: "modal",
      attrs: { variant: "prompt", hideCloseButton: _vm.hideCloseButton }
    },
    [
      _c("div", { staticClass: "c-prompt-body" }, [
        _c("h2", {
          directives: [
            {
              name: "safe-html",
              rawName: "v-safe-html",
              value: _vm.title,
              expression: "title"
            }
          ],
          staticClass: "is-title-2 c-prompt-heading"
        }),
        _c("p", {
          directives: [
            {
              name: "safe-html",
              rawName: "v-safe-html",
              value: _vm.content,
              expression: "content"
            }
          ],
          staticClass: "c-prompt-content"
        }),
        _vm.primaryButton || _vm.secondaryButton ? _c("div", { staticClass: "c-buttons-container" }, [
          _c(
            "button",
            {
              staticClass: "is-outlined",
              attrs: { type: "button" },
              on: {
                click: function($event) {
                  $event.stopPropagation();
                  return _vm.onCtaClick("secondary");
                }
              }
            },
            [_vm._v(_vm._s(_vm.secondaryButton))]
          ),
          _c(
            "button",
            {
              attrs: { type: "button" },
              on: {
                click: function($event) {
                  $event.stopPropagation();
                  return _vm.onCtaClick("primary");
                }
              }
            },
            [_vm._v(_vm._s(_vm.primaryButton))]
          )
        ]) : _vm._e()
      ])
    ]
  );
};
var __vue_staticRenderFns__2 = [];
__vue_render__2._withStripped = true;
var __vue_inject_styles__2 = function(inject) {
  if (!inject) return;
  inject("data-v-ddd87a20_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-ddd87a20]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-ddd87a20] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-prompt-body[data-v-ddd87a20] {\n  position: relative;\n  display: block;\n  width: 100%;\n}\n.c-prompt-body .c-prompt-heading[data-v-ddd87a20] {\n  text-align: left;\n  margin-bottom: 2rem;\n}\n@media screen and (min-width: 769px), print {\n.c-prompt-body .c-prompt-heading[data-v-ddd87a20] {\n    text-align: center;\n}\n}\n.c-prompt-body .c-prompt-content[data-v-ddd87a20] {\n  text-align: center;\n  margin-bottom: 2rem;\n}\n.c-prompt-body .c-buttons-container[data-v-ddd87a20] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  column-gap: 1.25rem;\n  justify-content: center;\n}\n\n/*# sourceMappingURL=Prompt.vue.map */", map: { "version": 3, "sources": ["Prompt.vue", "src/serve/dashboard/views/containers/modal/Prompt.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AACtB,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;AClBA;EACA,kBAAA;EACA,cAAA;EACA,WAAA;ADqBA;ACnBA;EACA,gBAAA;EACA,mBAAA;ADqBA;AACA;ACxBA;IAKA,kBAAA;ADsBE;AACF;ACnBA;EACA,kBAAA;EACA,mBAAA;ADqBA;AClBA;EACA,kBAAA;EACA,aAAA;EACA,mBAAA;EACA,mBAAA;EACA,uBAAA;ADoBA;;AAEA,qCAAqC", "file": "Prompt.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-prompt-body {\n  position: relative;\n  display: block;\n  width: 100%;\n}\n.c-prompt-body .c-prompt-heading {\n  text-align: left;\n  margin-bottom: 2rem;\n}\n@media screen and (min-width: 769px), print {\n  .c-prompt-body .c-prompt-heading {\n    text-align: center;\n  }\n}\n.c-prompt-body .c-prompt-content {\n  text-align: center;\n  margin-bottom: 2rem;\n}\n.c-prompt-body .c-buttons-container {\n  position: relative;\n  display: flex;\n  align-items: center;\n  column-gap: 1.25rem;\n  justify-content: center;\n}\n\n/*# sourceMappingURL=Prompt.vue.map */", `<template lang='pug'>
ModalSimpleTemplate(
  ref='modal'
  variant='prompt'
  :hideCloseButton='hideCloseButton'
)
  .c-prompt-body
    h2.is-title-2.c-prompt-heading(v-safe-html='title')
    p.c-prompt-content(v-safe-html='content')

    .c-buttons-container(v-if='primaryButton || secondaryButton')
      button.is-outlined(
        type='button'
        @click.stop='onCtaClick("secondary")'
      ) {{ secondaryButton }}
      button(
        type='button'
        @click.stop='onCtaClick("primary")'
      ) {{ primaryButton }}
</template>

<script>
import sbp from '@sbp/sbp'
import { CLOSE_PROMPT, PROMPT_RESPONSE } from '../../../../../../src/serve/dashboard/views/utils/events.js'
import { PROMPT_ACTIONS } from '../../../../../../src/serve/dashboard/views/utils/constants.js'
import ModalSimpleTemplate from './ModalSimpleTemplate.vue'

export default {
  name: 'Prompt',
  components: {
    ModalSimpleTemplate
  },
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    primaryButton: {
      type: String,
      required: false
    },
    secondaryButton: {
      type: String,
      required: false
    },
    hideCloseButton: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onCtaClick (type = '') {
      const promptAction = ({
        'primary': PROMPT_ACTIONS.PRIMARY,
        'secondary': PROMPT_ACTIONS.SECONDARY
      })[type]

      this.$refs.modal.close(() => {
        sbp('okTurtles.events/emit', PROMPT_RESPONSE, promptAction)
        sbp('okTurtles.events/emit', CLOSE_PROMPT)
      })
    }
  }
}
<\/script>

<style lang='scss' scoped>
@use "../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-prompt-body {
  position: relative;
  display: block;
  width: 100%;

  .c-prompt-heading {
    text-align: left;
    margin-bottom: 2rem;

    @include tablet {
      text-align: center;
    }
  }

  .c-prompt-content {
    text-align: center;
    margin-bottom: 2rem;
  }

  .c-buttons-container {
    position: relative;
    display: flex;
    align-items: center;
    column-gap: 1.25rem;
    justify-content: center;
  }
}
</style>
`] }, media: void 0 });
};
var __vue_scope_id__2 = "data-v-ddd87a20";
var __vue_module_identifier__2 = void 0;
var __vue_is_functional_template__2 = false;
function __vue_normalize__2(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang='pug'>
ModalSimpleTemplate(
  ref='modal'
  variant='prompt'
  :hideCloseButton='hideCloseButton'
)
  .c-prompt-body
    h2.is-title-2.c-prompt-heading(v-safe-html='title')
    p.c-prompt-content(v-safe-html='content')

    .c-buttons-container(v-if='primaryButton || secondaryButton')
      button.is-outlined(
        type='button'
        @click.stop='onCtaClick("secondary")'
      ) {{ secondaryButton }}
      button(
        type='button'
        @click.stop='onCtaClick("primary")'
      ) {{ primaryButton }}
</template>

<script>
import sbp from '@sbp/sbp'
import { CLOSE_PROMPT, PROMPT_RESPONSE } from '../../../../../../src/serve/dashboard/views/utils/events.js'
import { PROMPT_ACTIONS } from '../../../../../../src/serve/dashboard/views/utils/constants.js'
import ModalSimpleTemplate from './ModalSimpleTemplate.vue'

export default {
  name: 'Prompt',
  components: {
    ModalSimpleTemplate
  },
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    primaryButton: {
      type: String,
      required: false
    },
    secondaryButton: {
      type: String,
      required: false
    },
    hideCloseButton: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onCtaClick (type = '') {
      const promptAction = ({
        'primary': PROMPT_ACTIONS.PRIMARY,
        'secondary': PROMPT_ACTIONS.SECONDARY
      })[type]

      this.$refs.modal.close(() => {
        sbp('okTurtles.events/emit', PROMPT_RESPONSE, promptAction)
        sbp('okTurtles.events/emit', CLOSE_PROMPT)
      })
    }
  }
}
<\/script>

<style lang='scss' scoped>
@use "../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-prompt-body {
  position: relative;
  display: block;
  width: 100%;

  .c-prompt-heading {
    text-align: left;
    margin-bottom: 2rem;

    @include tablet {
      text-align: center;
    }
  }

  .c-prompt-content {
    text-align: center;
    margin-bottom: 2rem;
  }

  .c-buttons-container {
    position: relative;
    display: flex;
    align-items: center;
    column-gap: 1.25rem;
    justify-content: center;
  }
}
</style>
`;
  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }
  component._scopeId = scope;
  if (true) {
    let hook;
    if (false) {
      hook = function(context) {
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
        if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
          context = __VUE_SSR_CONTEXT__;
        }
        if (style) {
          style.call(this, createInjectorSSR(context));
        }
        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      };
      component._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function(context) {
        style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
      } : function(context) {
        style.call(this, createInjector(context));
      };
    }
    if (hook !== void 0) {
      if (component.functional) {
        const originalRender = component.render;
        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        const existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }
  return component;
}
function __vue_create_injector__2() {
  const styles = __vue_create_injector__2.styles || (__vue_create_injector__2.styles = {});
  const isOldIE = typeof navigator !== "undefined" && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return;
    const group = isOldIE ? css.media || "default" : id;
    const style = styles[group] || (styles[group] = { ids: [], parts: [], element: void 0 });
    if (!style.ids.includes(id)) {
      let code = css.source;
      let index = style.ids.length;
      style.ids.push(id);
      if (false) {
        code += "\n/*# sourceURL=" + css.map.sources[0] + " */";
        code += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + " */";
      }
      if (isOldIE) {
        style.element = style.element || document.querySelector("style[data-group=" + group + "]");
      }
      if (!style.element) {
        const head = document.head || document.getElementsByTagName("head")[0];
        const el = style.element = document.createElement("style");
        el.type = "text/css";
        if (css.media) el.setAttribute("media", css.media);
        if (isOldIE) {
          el.setAttribute("data-group", group);
          el.setAttribute("data-next-index", "0");
        }
        head.appendChild(el);
      }
      if (isOldIE) {
        index = parseInt(style.element.getAttribute("data-next-index"));
        style.element.setAttribute("data-next-index", index + 1);
      }
      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join("\n");
      } else {
        const textNode = document.createTextNode(code);
        const nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
        else style.element.appendChild(textNode);
      }
    }
  };
}
var __vue_component__2 = /* @__PURE__ */ __vue_normalize__2(
  { render: __vue_render__2, staticRenderFns: __vue_staticRenderFns__2 },
  __vue_inject_styles__2,
  __vue_script__2,
  __vue_scope_id__2,
  __vue_is_functional_template__2,
  __vue_module_identifier__2,
  false,
  __vue_create_injector__2,
  void 0,
  void 0
);
var Prompt_default = __vue_component__2;

export {
  Prompt_default
};
