import {
  CLOSE_MODAL
} from "./chunk-JAZDRYJA.js";
import {
  L
} from "./chunk-ZI2WDK4P.js";
import {
  esm_default
} from "./chunk-UHFMZPCY.js";

// src/serve/dashboard/views/containers/modal/ModalTemplate.vue
var __vue_script__ = {
  name: "ModalTemplate",
  props: {
    title: String,
    icon: {
      type: String,
      required: false,
      default: "info"
    }
  },
  data() {
    return {
      isActive: true
    };
  },
  methods: {
    close() {
      if (!this.isActive) {
        return;
      }
      this.isActive = false;
      setTimeout(() => esm_default("okTurtles.events/emit", CLOSE_MODAL), 300);
    }
  }
};
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      directives: [{ name: "focus", rawName: "v-focus" }],
      staticClass: "c-modal",
      attrs: { role: "dialog", tabindex: "-1" }
    },
    [
      _c("transition", { attrs: { name: "fade", appear: "appear" } }, [
        _vm.isActive ? _c("div", {
          staticClass: "c-modal-background",
          on: { click: _vm.close }
        }) : _vm._e()
      ]),
      _c("transition", { attrs: { name: "zoom", appear: "appear" } }, [
        _vm.isActive ? _c(
          "div",
          { staticClass: "c-modal-content" },
          [
            _c(
              "header",
              { staticClass: "c-modal-header" },
              [
                _vm.title ? [
                  _c("i", { class: "icon-" + _vm.icon + " c-icon" }),
                  _c("h1", { staticClass: "is-title-2 c-title" }, [
                    _vm._v(_vm._s(_vm.title))
                  ])
                ] : _vm._e(),
                _c(
                  "button",
                  {
                    staticClass: "is-icon c-close-btn",
                    on: { click: _vm.close }
                  },
                  [_c("i", { staticClass: "icon-close" })]
                )
              ],
              2
            ),
            _c(
              "section",
              { staticClass: "c-modal-body" },
              [_vm._t("default")],
              2
            ),
            _vm._t("footer", function() {
              return [
                _c(
                  "footer",
                  { staticClass: "c-modal-footer" },
                  [
                    _c(
                      "i18n",
                      {
                        staticClass: "has-blue-background c-dismiss-btn",
                        attrs: { tag: "button" },
                        on: { click: _vm.close }
                      },
                      [_vm._v("Close")]
                    )
                  ],
                  1
                )
              ];
            })
          ],
          2
        ) : _vm._e()
      ])
    ],
    1
  );
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
var __vue_inject_styles__ = function(inject) {
  if (!inject) return;
  inject("data-v-11eced37_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-11eced37]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-11eced37] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-modal[data-v-11eced37] {\n  display: flex;\n  position: fixed;\n  z-index: 60;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  justify-content: center;\n  align-items: center;\n  max-width: 100vw;\n  overflow: auto;\n}\n.c-modal-background[data-v-11eced37] {\n  display: none;\n}\n@media screen and (min-width: 769px), print {\n.c-modal-background[data-v-11eced37] {\n    position: fixed;\n    display: block;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    background-color: rgba(10, 10, 10, 0.86);\n}\n}\n.c-modal-content[data-v-11eced37] {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n  margin: 0 auto;\n  background: var(--modal-bg-color);\n}\n@media screen and (min-width: 769px), print {\n.c-modal-content[data-v-11eced37] {\n    position: relative;\n    border-radius: 0.375rem;\n    width: 46rem;\n    max-width: calc(100vw - 4rem);\n    height: auto;\n    margin: auto;\n}\n}\n.c-modal-header[data-v-11eced37] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  padding: 0 1.25rem;\n  padding-right: 3.75rem;\n  height: 4.25rem;\n  flex-shrink: 0;\n  border-bottom: 1px solid var(--border);\n}\n.c-modal-body[data-v-11eced37] {\n  padding: 1.25rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  word-break: break-word;\n  min-height: 10.25rem;\n  flex-grow: 1;\n}\n@media screen and (min-width: 1200px) {\n.c-modal-body[data-v-11eced37] {\n    max-height: 26.75rem;\n}\n}\n.c-modal-footer[data-v-11eced37] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  height: 4.25rem;\n  flex-shrink: 0;\n  padding: 0 1.25rem;\n  border-top: 1px solid var(--border);\n}\n.c-title[data-v-11eced37] {\n  line-height: 1.1;\n}\n@media screen and (max-width: 440px) {\n.c-title[data-v-11eced37] {\n    font-size: 1.125rem;\n}\n}\n.c-icon[data-v-11eced37] {\n  display: inline-block;\n  margin-top: 2px;\n  margin-right: 0.5rem;\n  font-size: 1.75rem;\n  font-weight: 600;\n}\n@media screen and (max-width: 440px) {\n.c-icon[data-v-11eced37] {\n    font-size: 1.5rem;\n    margin-right: 0.25rem;\n}\n}\n.c-close-btn[data-v-11eced37] {\n  position: absolute;\n  right: 1.25rem;\n  top: 50%;\n  transform: translateY(-50%);\n  border-radius: 50%;\n  width: 2.25rem;\n  height: 2.25rem;\n}\n.c-close-btn i[data-v-11eced37] {\n  display: inline-block;\n  line-height: 1;\n  transform: translate(1px, 1px);\n}\n\n/*# sourceMappingURL=ModalTemplate.vue.map */", map: { "version": 3, "sources": ["ModalTemplate.vue", "src/serve/dashboard/views/containers/modal/ModalTemplate.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AC6GtB,qBAAA;AAGA;ED7GE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AC4EA;EAIA,kCAAA;EAAA,oCAAA;EAAA,2CAAA;EAAA,8CAAA;EAAA,iCAAA;EAAA,uDAAA;EAAA,4CAAA;EAAA,kDAAA;EAAA,wCAAA;EAAA,iDAAA;EAAA,4DAAA;EAAA,mCAAA;EAAA,sDAAA;EAAA,0CAAA;EAAA,+BAAA;EAAA,6CAAA;EAAA,mDAAA;EAAA,iCAAA;EAAA,wCAAA;EAAA,iCAAA;EAAA,4BAAA;EAAA,mCAAA;EAAA,+CAAA;EAAA,gCAAA;EAAA,8BAAA;EAAA,gCAAA;EAAA,0CAAA;EAAA,yBAAA;EAAA,yCAAA;EAAA,+CAAA;EAAA,kCAAA;EAAA,+BAAA;EAAA,mCAAA;EAAA,qCAAA;EAAA,uCAAA;EAAA,mDAAA;EAAA,8CAAA;EAAA,6BAAA;EAAA,sIAAA;EAAA,0BAAA;EAAA,iBAAA;EAAA,uCAAA;ADnCA;AC/BA;EACA,aAAA;EACA,eAAA;EACA,WAAA;EACA,OAAA;EACA,QAAA;EACA,MAAA;EACA,SAAA;EACA,uBAAA;EACA,mBAAA;EACA,gBAAA;EACA,cAAA;ADkCA;AChCA;EACA,aAAA;ADkCA;AC9CA;AAWA;IAIA,eAAA;IACA,cAAA;IACA,MAAA;IACA,SAAA;IACA,OAAA;IACA,QAAA;IACA,wCAAA;ADmCE;AACF;AChCA;EACA,kBAAA;EACA,aAAA;EACA,sBAAA;EACA,gBAAA;EACA,WAAA;EACA,YAAA;EACA,cAAA;EACA,iCAAA;ADkCA;ACnEA;AAyBA;IAWA,kBAAA;IACA,uBAAA;IACA,YAAA;IACA,6BAAA;IACA,YAAA;IACA,YAAA;ADmCE;AACF;AChCA;EACA,kBAAA;EACA,aAAA;EACA,mBAAA;EACA,kBAAA;EACA,sBAAA;EACA,eAAA;EACA,cAAA;EACA,sCAAA;ADkCA;AC/BA;EACA,gBAAA;EACA,gBAAA;EACA,kBAAA;EACA,sBAAA;EACA,oBAAA;EACA,YAAA;ADiCA;ACnFA;AA4CA;IASA,oBAAA;ADkCE;AACF;AC/BA;EACA,aAAA;EACA,mBAAA;EACA,yBAAA;EACA,eAAA;EACA,cAAA;EACA,kBAAA;EACA,mCAAA;ADiCA;AC7BA;EACA,gBAAA;ADgCA;AACA;AClCA;IAIA,mBAAA;ADiCE;AACF;AC9BA;EACA,qBAAA;EACA,eAAA;EACA,oBAAA;EAEA,kBAAA;EACA,gBAAA;ADgCA;AACA;ACvCA;IAUA,iBAAA;IACA,qBAAA;ADgCE;AACF;AC7BA;EACA,kBAAA;EACA,cAAA;EACA,QAAA;EACA,2BAAA;EACA,kBAAA;EACA,cAAA;EACA,eAAA;ADgCA;AC9BA;EACA,qBAAA;EACA,cAAA;EACA,8BAAA;ADgCA;;AAEA,4CAA4C", "file": "ModalTemplate.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-modal {\n  display: flex;\n  position: fixed;\n  z-index: 60;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  justify-content: center;\n  align-items: center;\n  max-width: 100vw;\n  overflow: auto;\n}\n.c-modal-background {\n  display: none;\n}\n@media screen and (min-width: 769px), print {\n  .c-modal-background {\n    position: fixed;\n    display: block;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    background-color: rgba(10, 10, 10, 0.86);\n  }\n}\n.c-modal-content {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n  margin: 0 auto;\n  background: var(--modal-bg-color);\n}\n@media screen and (min-width: 769px), print {\n  .c-modal-content {\n    position: relative;\n    border-radius: 0.375rem;\n    width: 46rem;\n    max-width: calc(100vw - 4rem);\n    height: auto;\n    margin: auto;\n  }\n}\n.c-modal-header {\n  position: relative;\n  display: flex;\n  align-items: center;\n  padding: 0 1.25rem;\n  padding-right: 3.75rem;\n  height: 4.25rem;\n  flex-shrink: 0;\n  border-bottom: 1px solid var(--border);\n}\n.c-modal-body {\n  padding: 1.25rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  word-break: break-word;\n  min-height: 10.25rem;\n  flex-grow: 1;\n}\n@media screen and (min-width: 1200px) {\n  .c-modal-body {\n    max-height: 26.75rem;\n  }\n}\n.c-modal-footer {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  height: 4.25rem;\n  flex-shrink: 0;\n  padding: 0 1.25rem;\n  border-top: 1px solid var(--border);\n}\n\n.c-title {\n  line-height: 1.1;\n}\n@media screen and (max-width: 440px) {\n  .c-title {\n    font-size: 1.125rem;\n  }\n}\n\n.c-icon {\n  display: inline-block;\n  margin-top: 2px;\n  margin-right: 0.5rem;\n  font-size: 1.75rem;\n  font-weight: 600;\n}\n@media screen and (max-width: 440px) {\n  .c-icon {\n    font-size: 1.5rem;\n    margin-right: 0.25rem;\n  }\n}\n\n.c-close-btn {\n  position: absolute;\n  right: 1.25rem;\n  top: 50%;\n  transform: translateY(-50%);\n  border-radius: 50%;\n  width: 2.25rem;\n  height: 2.25rem;\n}\n.c-close-btn i {\n  display: inline-block;\n  line-height: 1;\n  transform: translate(1px, 1px);\n}\n\n/*# sourceMappingURL=ModalTemplate.vue.map */", "<template lang='pug'>\n.c-modal(\n  role='dialog'\n  tabindex='-1'\n  v-focus=''\n)\n  transition(name='fade' appear)\n    .c-modal-background(v-if='isActive' @click='close')\n\n  transition(name='zoom' appear)\n    .c-modal-content(v-if='isActive')\n      header.c-modal-header\n        template(v-if='title')\n          i(:class='`icon-${icon} c-icon`')\n          h1.is-title-2.c-title {{ title }}\n\n        button.is-icon.c-close-btn(@click='close')\n          i.icon-close\n\n      section.c-modal-body\n        slot\n\n      slot(name='footer')\n        footer.c-modal-footer\n          i18n.has-blue-background.c-dismiss-btn(tag='button' @click='close') Close\n</template>\n\n<script>\nimport sbp from '@sbp/sbp'\nimport { CLOSE_MODAL } from '../../../../../../src/serve/dashboard/views/utils/events.js'\n\nexport default {\n  name: 'ModalTemplate',\n  props: {\n    title: String,\n    icon: {\n      type: String,\n      required: false,\n      default: 'info'\n    }\n  },\n  data () {\n    return {\n      isActive: true\n    }\n  },\n  methods: {\n    close () {\n      if (!this.isActive) { return }\n\n      this.isActive = false\n      setTimeout(() => sbp('okTurtles.events/emit', CLOSE_MODAL), 300)\n    }\n  }\n}\n<\/script>\n\n<style lang='scss' scoped>\n@use \"../../../../../../src/serve/dashboard/assets/style/_variables.scss\" as *;\n\n.c-modal {\n  display: flex;\n  position: fixed;\n  z-index: $zindex-modal;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  justify-content: center;\n  align-items: center;\n  max-width: 100vw;\n  overflow: auto;\n\n  &-background {\n    display: none;\n\n    @include tablet {\n      position: fixed;\n      display: block;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n      background-color: rgba(10, 10, 10, 0.86);\n    }\n  }\n\n  &-content {\n    position: absolute;\n    display: flex;\n    flex-direction: column;\n    overflow: hidden;\n    width: 100%;\n    height: 100%;\n    margin: 0 auto;\n    background: var(--modal-bg-color);\n\n    @include tablet {\n      position: relative;\n      border-radius: 0.375rem;\n      width: 46rem;\n      max-width: calc(100vw - 4rem);\n      height: auto;\n      margin: auto;\n    }\n  }\n\n  &-header {\n    position: relative;\n    display: flex;\n    align-items: center;\n    padding: 0 1.25rem;\n    padding-right: 3.75rem;\n    height: 4.25rem;\n    flex-shrink: 0;\n    border-bottom: 1px solid $border;\n  }\n\n  &-body {\n    padding: 1.25rem;\n    overflow-y: auto;\n    overflow-x: hidden;\n    word-break: break-word;\n    min-height: 10.25rem;\n    flex-grow: 1;\n\n    @include desktop {\n      max-height: 26.75rem;\n    }\n  }\n\n  &-footer {\n    display: flex;\n    align-items: center;\n    justify-content: flex-end;\n    height: 4.25rem;\n    flex-shrink: 0;\n    padding: 0 1.25rem;\n    border-top: 1px solid $border;\n  }\n}\n\n.c-title {\n  line-height: 1.1;\n\n  @include phone_narrow {\n    font-size: $size_3;\n  }\n}\n\n.c-icon {\n  display: inline-block;\n  margin-top: 2px;\n  margin-right: 0.5rem;\n  font: {\n    size: 1.75rem;\n    weight: 600;\n  }\n\n  @include phone_narrow {\n    font-size: 1.5rem;\n    margin-right: 0.25rem;\n  }\n}\n\n.c-close-btn {\n  position: absolute;\n  right: 1.25rem;\n  top: 50%;\n  transform: translateY(-50%);\n  border-radius: 50%;\n  width: 2.25rem;\n  height: 2.25rem;\n\n  i {\n    display: inline-block;\n    line-height: 1;\n    transform: translate(1px, 1px);\n  }\n}\n</style>\n"] }, media: void 0 });
};
var __vue_scope_id__ = "data-v-11eced37";
var __vue_module_identifier__ = void 0;
var __vue_is_functional_template__ = false;
function __vue_normalize__(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = "<template lang='pug'>\n.c-modal(\n  role='dialog'\n  tabindex='-1'\n  v-focus=''\n)\n  transition(name='fade' appear)\n    .c-modal-background(v-if='isActive' @click='close')\n\n  transition(name='zoom' appear)\n    .c-modal-content(v-if='isActive')\n      header.c-modal-header\n        template(v-if='title')\n          i(:class='`icon-${icon} c-icon`')\n          h1.is-title-2.c-title {{ title }}\n\n        button.is-icon.c-close-btn(@click='close')\n          i.icon-close\n\n      section.c-modal-body\n        slot\n\n      slot(name='footer')\n        footer.c-modal-footer\n          i18n.has-blue-background.c-dismiss-btn(tag='button' @click='close') Close\n</template>\n\n<script>\nimport sbp from '@sbp/sbp'\nimport { CLOSE_MODAL } from '../../../../../../src/serve/dashboard/views/utils/events.js'\n\nexport default {\n  name: 'ModalTemplate',\n  props: {\n    title: String,\n    icon: {\n      type: String,\n      required: false,\n      default: 'info'\n    }\n  },\n  data () {\n    return {\n      isActive: true\n    }\n  },\n  methods: {\n    close () {\n      if (!this.isActive) { return }\n\n      this.isActive = false\n      setTimeout(() => sbp('okTurtles.events/emit', CLOSE_MODAL), 300)\n    }\n  }\n}\n<\/script>\n\n<style lang='scss' scoped>\n@use \"../../../../../../src/serve/dashboard/assets/style/_variables.scss\" as *;\n\n.c-modal {\n  display: flex;\n  position: fixed;\n  z-index: $zindex-modal;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  justify-content: center;\n  align-items: center;\n  max-width: 100vw;\n  overflow: auto;\n\n  &-background {\n    display: none;\n\n    @include tablet {\n      position: fixed;\n      display: block;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n      background-color: rgba(10, 10, 10, 0.86);\n    }\n  }\n\n  &-content {\n    position: absolute;\n    display: flex;\n    flex-direction: column;\n    overflow: hidden;\n    width: 100%;\n    height: 100%;\n    margin: 0 auto;\n    background: var(--modal-bg-color);\n\n    @include tablet {\n      position: relative;\n      border-radius: 0.375rem;\n      width: 46rem;\n      max-width: calc(100vw - 4rem);\n      height: auto;\n      margin: auto;\n    }\n  }\n\n  &-header {\n    position: relative;\n    display: flex;\n    align-items: center;\n    padding: 0 1.25rem;\n    padding-right: 3.75rem;\n    height: 4.25rem;\n    flex-shrink: 0;\n    border-bottom: 1px solid $border;\n  }\n\n  &-body {\n    padding: 1.25rem;\n    overflow-y: auto;\n    overflow-x: hidden;\n    word-break: break-word;\n    min-height: 10.25rem;\n    flex-grow: 1;\n\n    @include desktop {\n      max-height: 26.75rem;\n    }\n  }\n\n  &-footer {\n    display: flex;\n    align-items: center;\n    justify-content: flex-end;\n    height: 4.25rem;\n    flex-shrink: 0;\n    padding: 0 1.25rem;\n    border-top: 1px solid $border;\n  }\n}\n\n.c-title {\n  line-height: 1.1;\n\n  @include phone_narrow {\n    font-size: $size_3;\n  }\n}\n\n.c-icon {\n  display: inline-block;\n  margin-top: 2px;\n  margin-right: 0.5rem;\n  font: {\n    size: 1.75rem;\n    weight: 600;\n  }\n\n  @include phone_narrow {\n    font-size: 1.5rem;\n    margin-right: 0.25rem;\n  }\n}\n\n.c-close-btn {\n  position: absolute;\n  right: 1.25rem;\n  top: 50%;\n  transform: translateY(-50%);\n  border-radius: 50%;\n  width: 2.25rem;\n  height: 2.25rem;\n\n  i {\n    display: inline-block;\n    line-height: 1;\n    transform: translate(1px, 1px);\n  }\n}\n</style>\n";
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
var ModalTemplate_default = __vue_component__;

// src/serve/dashboard/views/components/TextToCopy.vue
var __vue_script__2 = {
  name: "TextToCopy",
  props: {
    tag: {
      type: String,
      required: false,
      default: "span"
    },
    text: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isCopied: false
    };
  },
  computed: {
    tooltipText() {
      return this.isCopied ? L("Copied to clipboard") : this.text;
    }
  },
  methods: {
    copyToClipBoard() {
      navigator.clipboard.writeText(this.text).then(() => {
        this.isCopied = true;
        setTimeout(() => {
          this.isCopied = false;
        }, 1200);
      });
    }
  }
};
var __vue_render__2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    _vm.tag,
    { tag: "component", staticClass: "c-text-to-copy-container" },
    [
      _c(
        "span",
        { staticClass: "c-text-content", on: { click: _vm.copyToClipBoard } },
        [
          _vm.$slots.default ? _vm._t("default") : _c("span", [_vm._v(_vm._s(_vm.text))])
        ],
        2
      ),
      _c(
        "button",
        {
          staticClass: "is-icon-small c-copy-btn",
          on: { click: _vm.copyToClipBoard }
        },
        [_c("i", { staticClass: "icon-copy" })]
      ),
      _c(
        "div",
        {
          staticClass: "tooltip font-small c-tooltip",
          class: { "is-active": _vm.isCopied }
        },
        [_vm._v(_vm._s(_vm.tooltipText))]
      )
    ]
  );
};
var __vue_staticRenderFns__2 = [];
__vue_render__2._withStripped = true;
var __vue_inject_styles__2 = function(inject) {
  if (!inject) return;
  inject("data-v-01768886_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-01768886]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-01768886] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-text-to-copy-container[data-v-01768886] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  width: max-content;\n  height: auto;\n  min-width: 0;\n  padding: 0.25rem 0.25rem 0.25rem 0.5rem;\n  border-radius: 0.5rem;\n  border: 1px solid var(--border);\n}\n.c-text-content[data-v-01768886] {\n  display: inline-block;\n  cursor: pointer;\n  line-height: 1.2;\n}\n.c-text-content[data-v-01768886]:hover {\n  text-decoration: underline;\n}\n.c-copy-btn[data-v-01768886] {\n  margin-left: 0.4rem;\n  border-color: var(--text_1);\n}\n.c-tooltip[data-v-01768886] {\n  word-break: break-all;\n}\n.c-text-content:hover ~ .c-tooltip[data-v-01768886] {\n  opacity: 1;\n}\n\n/*# sourceMappingURL=TextToCopy.vue.map */", map: { "version": 3, "sources": ["TextToCopy.vue", "src/serve/dashboard/views/components/TextToCopy.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AACtB,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;ACrCA;EACA,kBAAA;EACA,oBAAA;EACA,mBAAA;EACA,kBAAA;EACA,YAAA;EACA,YAAA;EACA,uCAAA;EACA,qBAAA;EACA,+BAAA;ADwCA;ACrCA;EACA,qBAAA;EACA,eAAA;EACA,gBAAA;ADwCA;ACtCA;EACA,0BAAA;ADwCA;ACpCA;EACA,mBAAA;EACA,2BAAA;ADuCA;ACpCA;EACA,qBAAA;ADuCA;ACpCA;EACA,UAAA;ADuCA;;AAEA,yCAAyC", "file": "TextToCopy.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-text-to-copy-container {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  width: max-content;\n  height: auto;\n  min-width: 0;\n  padding: 0.25rem 0.25rem 0.25rem 0.5rem;\n  border-radius: 0.5rem;\n  border: 1px solid var(--border);\n}\n\n.c-text-content {\n  display: inline-block;\n  cursor: pointer;\n  line-height: 1.2;\n}\n.c-text-content:hover {\n  text-decoration: underline;\n}\n\n.c-copy-btn {\n  margin-left: 0.4rem;\n  border-color: var(--text_1);\n}\n\n.c-tooltip {\n  word-break: break-all;\n}\n\n.c-text-content:hover ~ .c-tooltip {\n  opacity: 1;\n}\n\n/*# sourceMappingURL=TextToCopy.vue.map */", `<template lang='pug'>
component.c-text-to-copy-container(
  :is='tag'
)
  span.c-text-content(@click='copyToClipBoard')
    slot(v-if='$slots.default')
    span(v-else) {{ text }}

  button.is-icon-small.c-copy-btn(@click='copyToClipBoard')
    i.icon-copy

  .tooltip.font-small.c-tooltip(:class='{ "is-active": isCopied }') {{ tooltipText }}
</template>

<script>
import L from '../../../../../src/serve/dashboard/common/translations.js'

export default {
  name: 'TextToCopy',
  props: {
    tag: {
      type: String,
      required: false,
      default: 'span'
    },
    text: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isCopied: false
    }
  },
  computed: {
    tooltipText () {
      return this.isCopied ? L('Copied to clipboard') : this.text
    }
  },
  methods: {
    copyToClipBoard () {
      navigator.clipboard.writeText(this.text).then(() => {
        this.isCopied = true
        setTimeout(() => { this.isCopied = false }, 1200)
      })
    }
  }
}
<\/script>

<style lang='scss' scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-text-to-copy-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: max-content;
  height: auto;
  min-width: 0;
  padding: 0.25rem 0.25rem 0.25rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid $border;
}

.c-text-content {
  display: inline-block;
  cursor: pointer;
  line-height: 1.2;

  &:hover {
    text-decoration: underline;
  }
}

.c-copy-btn {
  margin-left: 0.4rem;
  border-color: $text_1;
}

.c-tooltip {
  word-break: break-all;
}

.c-text-content:hover ~ .c-tooltip {
  opacity: 1;
}
</style>
`] }, media: void 0 });
};
var __vue_scope_id__2 = "data-v-01768886";
var __vue_module_identifier__2 = void 0;
var __vue_is_functional_template__2 = false;
function __vue_normalize__2(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang='pug'>
component.c-text-to-copy-container(
  :is='tag'
)
  span.c-text-content(@click='copyToClipBoard')
    slot(v-if='$slots.default')
    span(v-else) {{ text }}

  button.is-icon-small.c-copy-btn(@click='copyToClipBoard')
    i.icon-copy

  .tooltip.font-small.c-tooltip(:class='{ "is-active": isCopied }') {{ tooltipText }}
</template>

<script>
import L from '../../../../../src/serve/dashboard/common/translations.js'

export default {
  name: 'TextToCopy',
  props: {
    tag: {
      type: String,
      required: false,
      default: 'span'
    },
    text: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isCopied: false
    }
  },
  computed: {
    tooltipText () {
      return this.isCopied ? L('Copied to clipboard') : this.text
    }
  },
  methods: {
    copyToClipBoard () {
      navigator.clipboard.writeText(this.text).then(() => {
        this.isCopied = true
        setTimeout(() => { this.isCopied = false }, 1200)
      })
    }
  }
}
<\/script>

<style lang='scss' scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-text-to-copy-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: max-content;
  height: auto;
  min-width: 0;
  padding: 0.25rem 0.25rem 0.25rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid $border;
}

.c-text-content {
  display: inline-block;
  cursor: pointer;
  line-height: 1.2;

  &:hover {
    text-decoration: underline;
  }
}

.c-copy-btn {
  margin-left: 0.4rem;
  border-color: $text_1;
}

.c-tooltip {
  word-break: break-all;
}

.c-text-content:hover ~ .c-tooltip {
  opacity: 1;
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
var TextToCopy_default = __vue_component__2;

// src/serve/dashboard/views/containers/modal/ViewContractManifestModal.vue
var __vue_script__3 = {
  name: "ViewContractManifestModal",
  components: {
    ModalTemplate: ModalTemplate_default,
    TextToCopy: TextToCopy_default
  },
  props: {
    contract: Object
  },
  computed: {
    content() {
      const manifest = this.contract.manifestJSON;
      const stringify = (content) => JSON.stringify(content).replace(/\\/g, "");
      return {
        head: stringify(manifest.head),
        body: stringify(manifest.body),
        signature: stringify(manifest.signature)
      };
    }
  }
};
var __vue_render__3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "ModalTemplate",
    { attrs: { title: _vm.L("Contract manifest"), icon: "suitcase" } },
    [
      _c(
        "div",
        { staticClass: "c-contract-id-container" },
        [
          _c("span", { staticClass: "c-id-label has-family-poppins" }, [
            _vm._v("contractID :")
          ]),
          _c(
            "TextToCopy",
            {
              staticClass: "c-id-copy",
              attrs: { text: _vm.contract.contractId }
            },
            [
              _c("div", { staticClass: "c-id-value" }, [
                _vm._v(_vm._s(_vm.contract.contractId))
              ])
            ]
          )
        ],
        1
      ),
      _c("div", { staticClass: "c-code-demo-container" }, [
        _c("div", { staticClass: "c-code-demo-block" }, [
          _c("div", { staticClass: "c-code-demo-label" }, [_vm._v("head")]),
          _c("pre", { staticClass: "custom-pre" }, [
            _vm._v(_vm._s(_vm.content.head))
          ])
        ]),
        _c("div", { staticClass: "c-code-demo-block" }, [
          _c("div", { staticClass: "c-code-demo-label" }, [_vm._v("body")]),
          _c("pre", { staticClass: "custom-pre" }, [
            _vm._v(_vm._s(_vm.content.body) + "}")
          ])
        ]),
        _c("div", { staticClass: "c-code-demo-block" }, [
          _c("div", { staticClass: "c-code-demo-label" }, [
            _vm._v("signature")
          ]),
          _c("pre", { staticClass: "custom-pre" }, [
            _vm._v(_vm._s(_vm.content.signature))
          ])
        ])
      ])
    ]
  );
};
var __vue_staticRenderFns__3 = [];
__vue_render__3._withStripped = true;
var __vue_inject_styles__3 = function(inject) {
  if (!inject) return;
  inject("data-v-66d7fa76_0", { source: '/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-66d7fa76]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-66d7fa76] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-contract-id-container[data-v-66d7fa76] {\n  position: relative;\n  padding-left: 0.8rem;\n  display: flex;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.c-contract-id-container[data-v-66d7fa76]::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  top: 0;\n  height: 100%;\n  width: 0.4rem;\n  background-color: var(--text_1);\n}\n.c-contract-id-container .c-id-label[data-v-66d7fa76] {\n  display: inline-block;\n  margin-right: 0.4rem;\n  font-weight: 600;\n  font-size: 0.875rem;\n}\n.c-contract-id-container .c-id-value[data-v-66d7fa76] {\n  display: inline-block;\n  max-width: 10rem;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  direction: rtl;\n  margin-top: 2px;\n}\n@media screen and (max-width: 440px) {\n.c-contract-id-container .c-id-value[data-v-66d7fa76] {\n    max-width: 7.5rem;\n}\n}\n.c-code-demo-block[data-v-66d7fa76] {\n  position: relative;\n  margin-bottom: 1.2rem;\n}\n.c-code-demo-label[data-v-66d7fa76] {\n  display: block;\n  font-weight: 600;\n  font-size: 0.875rem;\n  font-family: "Poppins";\n  margin-bottom: 0.4rem;\n  margin-left: 0.2rem;\n}\n\n/*# sourceMappingURL=ViewContractManifestModal.vue.map */', map: { "version": 3, "sources": ["ViewContractManifestModal.vue", "src/serve/dashboard/views/containers/modal/ViewContractManifestModal.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AACtB,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;ACvCA;EACA,kBAAA;EACA,oBAAA;EACA,aAAA;EACA,mBAAA;EACA,mBAAA;AD0CA;ACxCA;EACA,WAAA;EACA,kBAAA;EACA,OAAA;EACA,MAAA;EACA,YAAA;EACA,aAAA;EACA,+BAAA;AD0CA;ACvCA;EACA,qBAAA;EACA,oBAAA;EACA,gBAAA;EACA,mBAAA;ADyCA;ACtCA;EACA,qBAAA;EACA,gBAAA;EACA,gBAAA;EACA,mBAAA;EACA,uBAAA;EACA,cAAA;EACA,eAAA;ADwCA;ACzEA;AA0BA;IAUA,iBAAA;ADyCE;AACF;ACrCA;EACA,kBAAA;EACA,qBAAA;ADwCA;ACrCA;EACA,cAAA;EACA,gBAAA;EACA,mBAAA;EACA,sBAAA;EACA,qBAAA;EACA,mBAAA;ADwCA;;AAEA,wDAAwD", "file": "ViewContractManifestModal.vue", "sourcesContent": ['/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-contract-id-container {\n  position: relative;\n  padding-left: 0.8rem;\n  display: flex;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.c-contract-id-container::before {\n  content: "";\n  position: absolute;\n  left: 0;\n  top: 0;\n  height: 100%;\n  width: 0.4rem;\n  background-color: var(--text_1);\n}\n.c-contract-id-container .c-id-label {\n  display: inline-block;\n  margin-right: 0.4rem;\n  font-weight: 600;\n  font-size: 0.875rem;\n}\n.c-contract-id-container .c-id-value {\n  display: inline-block;\n  max-width: 10rem;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  direction: rtl;\n  margin-top: 2px;\n}\n@media screen and (max-width: 440px) {\n  .c-contract-id-container .c-id-value {\n    max-width: 7.5rem;\n  }\n}\n\n.c-code-demo-block {\n  position: relative;\n  margin-bottom: 1.2rem;\n}\n\n.c-code-demo-label {\n  display: block;\n  font-weight: 600;\n  font-size: 0.875rem;\n  font-family: "Poppins";\n  margin-bottom: 0.4rem;\n  margin-left: 0.2rem;\n}\n\n/*# sourceMappingURL=ViewContractManifestModal.vue.map */', `<template lang="pug">
ModalTemplate(:title='L("Contract manifest")' icon='suitcase')
  .c-contract-id-container
    span.c-id-label.has-family-poppins contractID :
    TextToCopy.c-id-copy(:text='contract.contractId')
      .c-id-value {{ contract.contractId }}

  .c-code-demo-container
    .c-code-demo-block
      .c-code-demo-label head
      pre.custom-pre {{ content.head }}

    .c-code-demo-block
      .c-code-demo-label body
      pre.custom-pre {{ content.body }}}

    .c-code-demo-block
      .c-code-demo-label signature
      pre.custom-pre {{ content.signature }}
</template>

<script>
import ModalTemplate from './ModalTemplate.vue'
import TextToCopy from '../../../../../../src/serve/dashboard/views/components/TextToCopy.vue'

export default {
  name: 'ViewContractManifestModal',
  components: {
    ModalTemplate,
    TextToCopy
  },
  props: {
    contract: Object
  },
  computed: {
    content () {
      const manifest = this.contract.manifestJSON
      const stringify = content => JSON.stringify(content).replace(/\\\\/g, '')

      return {
        head: stringify(manifest.head),
        body: stringify(manifest.body),
        signature: stringify(manifest.signature)
      }
    }
  }
}
<\/script>

<style lang='scss' scoped>
@use "../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-contract-id-container {
  position: relative;
  padding-left: 0.8rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0.4rem;
    background-color: $text_1;
  }

  .c-id-label {
    display: inline-block;
    margin-right: 0.4rem;
    font-weight: 600;
    font-size: $size_5;
  }

  .c-id-value {
    display: inline-block;
    max-width: 10rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    direction: rtl;
    margin-top: 2px;

    @include phone_narrow {
      max-width: 7.5rem;
    }
  }
}

.c-code-demo-block {
  position: relative;
  margin-bottom: 1.2rem;
}

.c-code-demo-label {
  display: block;
  font-weight: 600;
  font-size: $size_5;
  font-family: "Poppins";
  margin-bottom: 0.4rem;
  margin-left: 0.2rem;
}
</style>
`] }, media: void 0 });
};
var __vue_scope_id__3 = "data-v-66d7fa76";
var __vue_module_identifier__3 = void 0;
var __vue_is_functional_template__3 = false;
function __vue_normalize__3(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang="pug">
ModalTemplate(:title='L("Contract manifest")' icon='suitcase')
  .c-contract-id-container
    span.c-id-label.has-family-poppins contractID :
    TextToCopy.c-id-copy(:text='contract.contractId')
      .c-id-value {{ contract.contractId }}

  .c-code-demo-container
    .c-code-demo-block
      .c-code-demo-label head
      pre.custom-pre {{ content.head }}

    .c-code-demo-block
      .c-code-demo-label body
      pre.custom-pre {{ content.body }}}

    .c-code-demo-block
      .c-code-demo-label signature
      pre.custom-pre {{ content.signature }}
</template>

<script>
import ModalTemplate from './ModalTemplate.vue'
import TextToCopy from '../../../../../../src/serve/dashboard/views/components/TextToCopy.vue'

export default {
  name: 'ViewContractManifestModal',
  components: {
    ModalTemplate,
    TextToCopy
  },
  props: {
    contract: Object
  },
  computed: {
    content () {
      const manifest = this.contract.manifestJSON
      const stringify = content => JSON.stringify(content).replace(/\\\\/g, '')

      return {
        head: stringify(manifest.head),
        body: stringify(manifest.body),
        signature: stringify(manifest.signature)
      }
    }
  }
}
<\/script>

<style lang='scss' scoped>
@use "../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-contract-id-container {
  position: relative;
  padding-left: 0.8rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0.4rem;
    background-color: $text_1;
  }

  .c-id-label {
    display: inline-block;
    margin-right: 0.4rem;
    font-weight: 600;
    font-size: $size_5;
  }

  .c-id-value {
    display: inline-block;
    max-width: 10rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    direction: rtl;
    margin-top: 2px;

    @include phone_narrow {
      max-width: 7.5rem;
    }
  }
}

.c-code-demo-block {
  position: relative;
  margin-bottom: 1.2rem;
}

.c-code-demo-label {
  display: block;
  font-weight: 600;
  font-size: $size_5;
  font-family: "Poppins";
  margin-bottom: 0.4rem;
  margin-left: 0.2rem;
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
function __vue_create_injector__3() {
  const styles = __vue_create_injector__3.styles || (__vue_create_injector__3.styles = {});
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
var __vue_component__3 = /* @__PURE__ */ __vue_normalize__3(
  { render: __vue_render__3, staticRenderFns: __vue_staticRenderFns__3 },
  __vue_inject_styles__3,
  __vue_script__3,
  __vue_scope_id__3,
  __vue_is_functional_template__3,
  __vue_module_identifier__3,
  false,
  __vue_create_injector__3,
  void 0,
  void 0
);
var ViewContractManifestModal_default = __vue_component__3;
export {
  ViewContractManifestModal_default as default
};
