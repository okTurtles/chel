import {
  L,
  require_vue
} from "./chunk-ZI2WDK4P.js";
import {
  __commonJS,
  __toESM
} from "./chunk-UHFMZPCY.js";

// node_modules/.deno/vue-clickaway@2.2.2/node_modules/vue-clickaway/dist/vue-clickaway.common.js
var require_vue_clickaway_common = __commonJS({
  "node_modules/.deno/vue-clickaway@2.2.2/node_modules/vue-clickaway/dist/vue-clickaway.common.js"(exports) {
    "use strict";
    var Vue = require_vue();
    Vue = "default" in Vue ? Vue["default"] : Vue;
    var version = "2.2.2";
    var compatible = /^2\./.test(Vue.version);
    if (!compatible) {
      Vue.util.warn("VueClickaway " + version + " only supports Vue 2.x, and does not support Vue " + Vue.version);
    }
    var HANDLER = "_vue_clickaway_handler";
    function bind(el, binding, vnode) {
      unbind(el);
      var vm = vnode.context;
      var callback = binding.value;
      if (typeof callback !== "function") {
        if (true) {
          Vue.util.warn(
            "v-" + binding.name + '="' + binding.expression + '" expects a function value, got ' + callback
          );
        }
        return;
      }
      var initialMacrotaskEnded = false;
      setTimeout(function() {
        initialMacrotaskEnded = true;
      }, 0);
      el[HANDLER] = function(ev) {
        var path = ev.path || (ev.composedPath ? ev.composedPath() : void 0);
        if (initialMacrotaskEnded && (path ? path.indexOf(el) < 0 : !el.contains(ev.target))) {
          return callback.call(vm, ev);
        }
      };
      document.documentElement.addEventListener("click", el[HANDLER], false);
    }
    function unbind(el) {
      document.documentElement.removeEventListener("click", el[HANDLER], false);
      delete el[HANDLER];
    }
    var directive = {
      bind,
      update: function(el, binding) {
        if (binding.value === binding.oldValue) return;
        bind(el, binding);
      },
      unbind
    };
    var mixin = {
      directives: { onClickaway: directive }
    };
    exports.version = version;
    exports.directive = directive;
    exports.mixin = mixin;
  }
});

// src/serve/dashboard/views/components/forms/Dropdown.vue
var import_npm_vue_clickaway = __toESM(require_vue_clickaway_common());
var __vue_script__ = {
  name: "Dropdown",
  mixins: [import_npm_vue_clickaway.clickaway],
  props: {
    defaultText: {
      type: String,
      required: false,
      default: L("Select Item")
    },
    defaultItemId: {
      // 'id' of the option we want as a default
      type: String,
      required: false,
      default: ""
    },
    options: {
      // The format of the list must be { id: string, name: string, ... }
      type: Array,
      required: true
    },
    isOverlayStyle: {
      type: Boolean,
      required: false,
      default: false
    },
    disableClickAway: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ephemeral: {
        selectedId: this.defaultItemId || "",
        isActive: false
      }
    };
  },
  computed: {
    buttonText() {
      return this.ephemeral.selectedId ? this.options.find((item) => item.id === this.ephemeral.selectedId).name : this.defaultText;
    },
    optionsToDisplay() {
      return this.ephemeral.selectedId ? this.options.filter((opt) => opt.id !== this.ephemeral.selectedId) : this.options;
    }
  },
  methods: {
    open() {
      this.ephemeral.isActive = true;
    },
    close() {
      this.ephemeral.isActive = false;
    },
    toggle() {
      if (this.ephemeral.isActive) this.close();
      else this.open();
    },
    onItemSelect(item) {
      this.ephemeral.selectedId = item.id;
      this.$emit("select", item);
      this.close();
      this.$refs.button.focus();
    },
    onClickedAway() {
      if (!this.disableClickAway) {
        this.close();
        this.$emit("blur");
      }
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
      directives: [
        {
          name: "on-clickaway",
          rawName: "v-on-clickaway",
          value: _vm.onClickedAway,
          expression: "onClickedAway"
        }
      ],
      staticClass: "c-dropdown-wrapper",
      class: {
        "is-active": _vm.ephemeral.isActive,
        "is-overlay-style": _vm.isOverlayStyle
      }
    },
    [
      _c(
        "button",
        {
          ref: "button",
          staticClass: "is-outlined c-dropdown-trigger",
          on: {
            click: _vm.toggle,
            blur: function($event) {
              return _vm.$emit("blur");
            }
          }
        },
        [
          _c("span", { staticClass: "c-trigger-btn-text" }, [
            _vm._v(_vm._s(_vm.buttonText))
          ]),
          _c("i", { staticClass: "icon-caret-down c-trigger-btn-arrow" })
        ]
      ),
      _vm.options && _vm.ephemeral.isActive ? _c(
        "ul",
        { staticClass: "c-dropdown-options-list" },
        _vm._l(_vm.optionsToDisplay, function(item) {
          return _c(
            "li",
            {
              key: item.id,
              staticClass: "c-dropdown-options-list-item",
              attrs: { tabindex: "0" },
              on: {
                click: function($event) {
                  return _vm.onItemSelect(item);
                }
              }
            },
            [_c("span", [_vm._v(_vm._s(item.name))])]
          );
        }),
        0
      ) : _vm._e()
    ]
  );
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
var __vue_inject_styles__ = function(inject) {
  if (!inject) return;
  inject("data-v-6e35d86a_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-6e35d86a]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-6e35d86a] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-dropdown-wrapper[data-v-6e35d86a] {\n  position: relative;\n  min-width: 7.75rem;\n  width: 100%;\n  height: max-content;\n}\n.c-dropdown-wrapper.is-overlay-style[data-v-6e35d86a] {\n  width: max-content;\n}\n.c-dropdown-trigger[data-v-6e35d86a] {\n  position: relative;\n  display: flex;\n  justify-content: flex-start;\n  width: 100%;\n  min-width: inherit;\n  border: 1px solid var(--text_1);\n  min-height: 2.25rem;\n  padding: 0.75rem 2.25rem 0.75rem 0.625rem;\n  font-size: 0.875rem;\n  font-weight: normal;\n  line-height: 1;\n  background-color: var(--dropdown-bg-color);\n  transition: none;\n}\n.c-dropdown-trigger[data-v-6e35d86a]:focus, .c-dropdown-trigger[data-v-6e35d86a]:hover {\n  background-color: var(--dropdown-bg-color);\n  box-shadow: var(--dropdown-box-shadow);\n  border: 1px solid var(--button-outline-text-color);\n}\n.is-overlay-style .c-dropdown-trigger[data-v-6e35d86a] {\n  width: unset;\n}\n.c-trigger-btn-arrow[data-v-6e35d86a] {\n  display: inline-block;\n  position: absolute;\n  top: 50%;\n  right: 0.75rem;\n  transform: translateY(-50%);\n  font-size: 1.1em;\n  font-weight: 600;\n  margin-left: 1rem;\n  transition: transform 300ms ease-out;\n}\n.c-dropdown-options-list[data-v-6e35d86a] {\n  position: relative;\n  margin-top: 0.25rem;\n  min-width: 100%;\n  border-radius: 0.5rem;\n  border: 1px solid var(--text_1);\n  overflow: hidden;\n  height: auto;\n  width: max-content;\n  box-shadow: var(--dropdown-box-shadow);\n  background-color: var(--dropdown-bg-color);\n  z-index: 10;\n  opacity: 0;\n  transform: translateY(1.5rem);\n}\n.is-overlay-style .c-dropdown-options-list[data-v-6e35d86a] {\n  position: absolute;\n  right: 0;\n  top: 100%;\n  margin-top: 0;\n}\n.c-dropdown-options-list-item[data-v-6e35d86a] {\n  display: flex;\n  align-items: center;\n  text-align: right;\n  width: 100%;\n  min-height: 2.25rem;\n  padding: 0.75rem 0.625rem;\n  user-select: none;\n  cursor: pointer;\n}\n.c-dropdown-options-list-item[data-v-6e35d86a]:hover, .c-dropdown-options-list-item[data-v-6e35d86a]:active {\n  background-color: var(--dropdown-active-bg-color);\n}\n.c-dropdown-options-list-item[data-v-6e35d86a]:not(:last-child) {\n  border-bottom: 1px solid var(--border);\n}\n.c-dropdown-options-list-item span[data-v-6e35d86a] {\n  display: inline-block;\n}\n.c-dropdown-wrapper.is-active[data-v-6e35d86a]:not(.is-overlay-style) {\n  margin-bottom: 1rem;\n}\n.c-dropdown-wrapper.is-active .c-trigger-btn-arrow[data-v-6e35d86a] {\n  transform: translateY(-50%) rotate(180deg);\n}\n.c-dropdown-wrapper.is-active .c-dropdown-options-list[data-v-6e35d86a] {\n  animation: dropdown-menu-reveal-data-v-6e35d86a 300ms ease-out forwards;\n}\n.c-dropdown-wrapper.is-error .c-dropdown-trigger[data-v-6e35d86a] {\n  border-color: var(--danger);\n}\n@keyframes dropdown-menu-reveal-data-v-6e35d86a {\n0% {\n    opacity: 0;\n    transform: translateY(1.5rem);\n}\n100% {\n    opacity: 1;\n    transform: translateY(0.5rem);\n}\n}\n\n/*# sourceMappingURL=Dropdown.vue.map */", map: { "version": 3, "sources": ["Dropdown.vue", "src/serve/dashboard/views/components/forms/Dropdown.vue"], "names": [], "mappings": "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", "file": "Dropdown.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-dropdown-wrapper {\n  position: relative;\n  min-width: 7.75rem;\n  width: 100%;\n  height: max-content;\n}\n.c-dropdown-wrapper.is-overlay-style {\n  width: max-content;\n}\n\n.c-dropdown-trigger {\n  position: relative;\n  display: flex;\n  justify-content: flex-start;\n  width: 100%;\n  min-width: inherit;\n  border: 1px solid var(--text_1);\n  min-height: 2.25rem;\n  padding: 0.75rem 2.25rem 0.75rem 0.625rem;\n  font-size: 0.875rem;\n  font-weight: normal;\n  line-height: 1;\n  background-color: var(--dropdown-bg-color);\n  transition: none;\n}\n.c-dropdown-trigger:focus, .c-dropdown-trigger:hover {\n  background-color: var(--dropdown-bg-color);\n  box-shadow: var(--dropdown-box-shadow);\n  border: 1px solid var(--button-outline-text-color);\n}\n.is-overlay-style .c-dropdown-trigger {\n  width: unset;\n}\n\n.c-trigger-btn-arrow {\n  display: inline-block;\n  position: absolute;\n  top: 50%;\n  right: 0.75rem;\n  transform: translateY(-50%);\n  font-size: 1.1em;\n  font-weight: 600;\n  margin-left: 1rem;\n  transition: transform 300ms ease-out;\n}\n\n.c-dropdown-options-list {\n  position: relative;\n  margin-top: 0.25rem;\n  min-width: 100%;\n  border-radius: 0.5rem;\n  border: 1px solid var(--text_1);\n  overflow: hidden;\n  height: auto;\n  width: max-content;\n  box-shadow: var(--dropdown-box-shadow);\n  background-color: var(--dropdown-bg-color);\n  z-index: 10;\n  opacity: 0;\n  transform: translateY(1.5rem);\n}\n.is-overlay-style .c-dropdown-options-list {\n  position: absolute;\n  right: 0;\n  top: 100%;\n  margin-top: 0;\n}\n.c-dropdown-options-list-item {\n  display: flex;\n  align-items: center;\n  text-align: right;\n  width: 100%;\n  min-height: 2.25rem;\n  padding: 0.75rem 0.625rem;\n  user-select: none;\n  cursor: pointer;\n}\n.c-dropdown-options-list-item:hover, .c-dropdown-options-list-item:active {\n  background-color: var(--dropdown-active-bg-color);\n}\n.c-dropdown-options-list-item:not(:last-child) {\n  border-bottom: 1px solid var(--border);\n}\n.c-dropdown-options-list-item span {\n  display: inline-block;\n}\n\n.c-dropdown-wrapper.is-active:not(.is-overlay-style) {\n  margin-bottom: 1rem;\n}\n.c-dropdown-wrapper.is-active .c-trigger-btn-arrow {\n  transform: translateY(-50%) rotate(180deg);\n}\n.c-dropdown-wrapper.is-active .c-dropdown-options-list {\n  animation: dropdown-menu-reveal 300ms ease-out forwards;\n}\n\n.c-dropdown-wrapper.is-error .c-dropdown-trigger {\n  border-color: var(--danger);\n}\n\n@keyframes dropdown-menu-reveal {\n  0% {\n    opacity: 0;\n    transform: translateY(1.5rem);\n  }\n  100% {\n    opacity: 1;\n    transform: translateY(0.5rem);\n  }\n}\n\n/*# sourceMappingURL=Dropdown.vue.map */", `<template lang="pug">
.c-dropdown-wrapper(
  :class='{ "is-active": ephemeral.isActive, "is-overlay-style": isOverlayStyle }'
  v-on-clickaway='onClickedAway'
)
  button.is-outlined.c-dropdown-trigger(ref='button' @click='toggle' @blur='$emit("blur")')
    span.c-trigger-btn-text {{ buttonText }}
    i.icon-caret-down.c-trigger-btn-arrow

  ul.c-dropdown-options-list(v-if='options && ephemeral.isActive')
    li.c-dropdown-options-list-item(
      v-for='item in optionsToDisplay'
      :key='item.id'
      tabindex='0'
      @click='onItemSelect(item)'
    )
      span {{ item.name }}
</template>

<script>
import L from '../../../../../../src/serve/dashboard/common/translations.js'
import { clickaway } from 'npm:vue-clickaway'

export default {
  name: 'Dropdown',
  mixins: [clickaway],
  props: {
    defaultText: {
      type: String,
      required: false,
      default: L('Select Item')
    },
    defaultItemId: { // 'id' of the option we want as a default
      type: String,
      required: false,
      default: ''
    },
    options: {
      // The format of the list must be { id: string, name: string, ... }
      type: Array,
      required: true
    },
    isOverlayStyle: {
      type: Boolean,
      required: false,
      default: false
    },
    disableClickAway: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ephemeral: {
        selectedId: this.defaultItemId || '',
        isActive: false
      }
    }
  },
  computed: {
    buttonText () {
      return this.ephemeral.selectedId
        ? this.options.find(item => item.id === this.ephemeral.selectedId).name
        : this.defaultText
    },
    optionsToDisplay () {
      return this.ephemeral.selectedId ? this.options.filter(opt => opt.id !== this.ephemeral.selectedId) : this.options
    }
  },
  methods: {
    open () {
      this.ephemeral.isActive = true
    },
    close () {
      this.ephemeral.isActive = false
    },
    toggle () {
      if (this.ephemeral.isActive) this.close()
      else this.open()
    },
    onItemSelect (item) {
      this.ephemeral.selectedId = item.id
      this.$emit('select', item)
      this.close()

      this.$refs.button.focus()
    },
    onClickedAway () {
      if (!this.disableClickAway) {
        this.close()
        this.$emit('blur')
      }
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-dropdown-wrapper {
  position: relative;
  min-width: 7.75rem;
  width: 100%;
  height: max-content;

  &.is-overlay-style {
    width: max-content;
  }
}

.c-dropdown-trigger {
  position: relative;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  min-width: inherit;
  border: 1px solid $text_1;
  min-height: 2.25rem;
  padding: 0.75rem 2.25rem 0.75rem 0.625rem;
  font-size: $size_5;
  font-weight: normal;
  line-height: 1;
  background-color: var(--dropdown-bg-color);
  transition: none;

  &:focus,
  &:hover {
    background-color: var(--dropdown-bg-color);
    box-shadow: var(--dropdown-box-shadow);
    border: 1px solid var(--button-outline-text-color);
  }

  .is-overlay-style & {
    width: unset;
  }
}

.c-trigger-btn-arrow {
  display: inline-block;
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  font-size: 1.1em;
  font-weight: 600;
  margin-left: 1rem;
  transition: transform 300ms ease-out;
}

.c-dropdown-options-list {
  position: relative;
  margin-top: 0.25rem;
  min-width: 100%;
  border-radius: 0.5rem;
  border: 1px solid $text_1;
  overflow: hidden;
  height: auto;
  width: max-content;
  box-shadow: var(--dropdown-box-shadow);
  background-color: var(--dropdown-bg-color);
  z-index: 10;
  opacity: 0;
  transform: translateY(1.5rem);

  .is-overlay-style & {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0;
  }

  &-item {
    display: flex;
    align-items: center;
    text-align: right;
    width: 100%;
    min-height: 2.25rem;
    padding: 0.75rem 0.625rem;
    user-select: none;
    cursor: pointer;

    &:hover,
    &:active {
      background-color: var(--dropdown-active-bg-color);
    }

    &:not(:last-child) {
      border-bottom: 1px solid $border;
    }

    span {
      display: inline-block;
    }
  }
}

.c-dropdown-wrapper.is-active {
  &:not(.is-overlay-style) {
    margin-bottom: 1rem;
  }

  .c-trigger-btn-arrow {
    transform: translateY(-50%) rotate(180deg);
  }

  .c-dropdown-options-list {
    animation: dropdown-menu-reveal 300ms ease-out forwards;
  }
}

.c-dropdown-wrapper.is-error {
  .c-dropdown-trigger {
    border-color: $danger;
  }
}

@keyframes dropdown-menu-reveal {
  0% {
    opacity: 0;
    transform: translateY(1.5rem);
  }

  100% {
    opacity: 1;
    transform: translateY(0.5rem);
  }
}
</style>
`] }, media: void 0 });
};
var __vue_scope_id__ = "data-v-6e35d86a";
var __vue_module_identifier__ = void 0;
var __vue_is_functional_template__ = false;
function __vue_normalize__(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang="pug">
.c-dropdown-wrapper(
  :class='{ "is-active": ephemeral.isActive, "is-overlay-style": isOverlayStyle }'
  v-on-clickaway='onClickedAway'
)
  button.is-outlined.c-dropdown-trigger(ref='button' @click='toggle' @blur='$emit("blur")')
    span.c-trigger-btn-text {{ buttonText }}
    i.icon-caret-down.c-trigger-btn-arrow

  ul.c-dropdown-options-list(v-if='options && ephemeral.isActive')
    li.c-dropdown-options-list-item(
      v-for='item in optionsToDisplay'
      :key='item.id'
      tabindex='0'
      @click='onItemSelect(item)'
    )
      span {{ item.name }}
</template>

<script>
import L from '../../../../../../src/serve/dashboard/common/translations.js'
import { clickaway } from 'npm:vue-clickaway'

export default {
  name: 'Dropdown',
  mixins: [clickaway],
  props: {
    defaultText: {
      type: String,
      required: false,
      default: L('Select Item')
    },
    defaultItemId: { // 'id' of the option we want as a default
      type: String,
      required: false,
      default: ''
    },
    options: {
      // The format of the list must be { id: string, name: string, ... }
      type: Array,
      required: true
    },
    isOverlayStyle: {
      type: Boolean,
      required: false,
      default: false
    },
    disableClickAway: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ephemeral: {
        selectedId: this.defaultItemId || '',
        isActive: false
      }
    }
  },
  computed: {
    buttonText () {
      return this.ephemeral.selectedId
        ? this.options.find(item => item.id === this.ephemeral.selectedId).name
        : this.defaultText
    },
    optionsToDisplay () {
      return this.ephemeral.selectedId ? this.options.filter(opt => opt.id !== this.ephemeral.selectedId) : this.options
    }
  },
  methods: {
    open () {
      this.ephemeral.isActive = true
    },
    close () {
      this.ephemeral.isActive = false
    },
    toggle () {
      if (this.ephemeral.isActive) this.close()
      else this.open()
    },
    onItemSelect (item) {
      this.ephemeral.selectedId = item.id
      this.$emit('select', item)
      this.close()

      this.$refs.button.focus()
    },
    onClickedAway () {
      if (!this.disableClickAway) {
        this.close()
        this.$emit('blur')
      }
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-dropdown-wrapper {
  position: relative;
  min-width: 7.75rem;
  width: 100%;
  height: max-content;

  &.is-overlay-style {
    width: max-content;
  }
}

.c-dropdown-trigger {
  position: relative;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  min-width: inherit;
  border: 1px solid $text_1;
  min-height: 2.25rem;
  padding: 0.75rem 2.25rem 0.75rem 0.625rem;
  font-size: $size_5;
  font-weight: normal;
  line-height: 1;
  background-color: var(--dropdown-bg-color);
  transition: none;

  &:focus,
  &:hover {
    background-color: var(--dropdown-bg-color);
    box-shadow: var(--dropdown-box-shadow);
    border: 1px solid var(--button-outline-text-color);
  }

  .is-overlay-style & {
    width: unset;
  }
}

.c-trigger-btn-arrow {
  display: inline-block;
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  font-size: 1.1em;
  font-weight: 600;
  margin-left: 1rem;
  transition: transform 300ms ease-out;
}

.c-dropdown-options-list {
  position: relative;
  margin-top: 0.25rem;
  min-width: 100%;
  border-radius: 0.5rem;
  border: 1px solid $text_1;
  overflow: hidden;
  height: auto;
  width: max-content;
  box-shadow: var(--dropdown-box-shadow);
  background-color: var(--dropdown-bg-color);
  z-index: 10;
  opacity: 0;
  transform: translateY(1.5rem);

  .is-overlay-style & {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0;
  }

  &-item {
    display: flex;
    align-items: center;
    text-align: right;
    width: 100%;
    min-height: 2.25rem;
    padding: 0.75rem 0.625rem;
    user-select: none;
    cursor: pointer;

    &:hover,
    &:active {
      background-color: var(--dropdown-active-bg-color);
    }

    &:not(:last-child) {
      border-bottom: 1px solid $border;
    }

    span {
      display: inline-block;
    }
  }
}

.c-dropdown-wrapper.is-active {
  &:not(.is-overlay-style) {
    margin-bottom: 1rem;
  }

  .c-trigger-btn-arrow {
    transform: translateY(-50%) rotate(180deg);
  }

  .c-dropdown-options-list {
    animation: dropdown-menu-reveal 300ms ease-out forwards;
  }
}

.c-dropdown-wrapper.is-error {
  .c-dropdown-trigger {
    border-color: $danger;
  }
}

@keyframes dropdown-menu-reveal {
  0% {
    opacity: 0;
    transform: translateY(1.5rem);
  }

  100% {
    opacity: 1;
    transform: translateY(0.5rem);
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
var Dropdown_default = __vue_component__;

export {
  Dropdown_default
};
