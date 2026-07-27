// src/serve/dashboard/views/components/StatCard.vue
var __vue_script__ = {
  name: "StatCard",
  props: {
    description: String,
    stat: [Number, String],
    icon: {
      type: String,
      default: "chart-bar",
      required: false
    },
    color: {
      type: String,
      validator: (v) => ["blue", "purple"].includes(v),
      default: "blue"
    }
  }
};
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "c-stat-card", class: "is-" + _vm.color }, [
    _c("span", { staticClass: "c-stat-desc" }, [
      _vm._v(_vm._s(_vm.description))
    ]),
    _c("span", { staticClass: "is-title-1 c-stat-value" }, [
      _vm._v(_vm._s(_vm.stat))
    ]),
    _c("i", { class: "icon-" + _vm.icon + " c-icon" })
  ]);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
var __vue_inject_styles__ = function(inject) {
  if (!inject) return;
  inject("data-v-657f40d0_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-657f40d0]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-657f40d0] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-stat-card[data-v-657f40d0] {\n  position: relative;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: stretch;\n  justify-content: flex-end;\n  width: 100%;\n  height: 5.2rem;\n  border-radius: 1rem;\n  padding: 0.75rem 1.5rem;\n  overflow: hidden;\n  box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n}\n@media screen and (min-width: 441px) {\n.c-stat-card[data-v-657f40d0] {\n    max-width: 13.25rem;\n    height: 7rem;\n    padding: 1.25rem 1.5rem;\n}\n}\n.c-stat-card.is-blue[data-v-657f40d0] {\n  background-color: var(--primary_blue);\n}\n.c-stat-card.is-purple[data-v-657f40d0] {\n  background-color: var(--primary_purple);\n}\n.c-stat-card > *[data-v-657f40d0] {\n  display: inline-block;\n}\n.c-stat-desc[data-v-657f40d0] {\n  display: inline-block;\n  font-size: 0.875rem;\n  color: var(--text_black);\n}\n@media screen and (min-width: 441px) {\n.c-stat-desc[data-v-657f40d0] {\n    margin-bottom: 0.25rem;\n}\n}\n.c-stat-value[data-v-657f40d0] {\n  letter-spacing: 1px;\n  line-height: 1;\n  color: var(--text_black);\n}\n@media screen and (min-width: 441px) {\n.c-stat-value[data-v-657f40d0] {\n    line-height: 1.2;\n}\n}\n.c-icon[data-v-657f40d0] {\n  position: absolute;\n  bottom: 0.2rem;\n  right: 0.85rem;\n  display: block;\n  color: var(--stat-card-icon-color);\n  opacity: 0.225;\n  font-size: 2.875rem;\n  font-weight: 600;\n  line-height: 1;\n}\n\n/*# sourceMappingURL=StatCard.vue.map */", map: { "version": 3, "sources": ["src/serve/dashboard/views/components/StatCard.vue", "StatCard.vue"], "names": [], "mappings": "AAiCA,sEAAA;AAEA,sBAAA;ACjCA,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;AD5DA;EACA,kBAAA;EACA,oBAAA;EACA,sBAAA;EACA,oBAAA;EACA,yBAAA;EACA,WAAA;EACA,cAAA;EACA,mBAAA;EACA,uBAAA;EACA,gBAAA;EACA,6CAAA;AC+DA;ADnEA;AAPA;IAcA,mBAAA;IACA,YAAA;IACA,uBAAA;ACgEE;AACF;AD9DA;EACA,qCAAA;ACgEA;AD7DA;EACA,uCAAA;AC+DA;AD5DA;EACA,qBAAA;AC8DA;AD1DA;EACA,qBAAA;EACA,mBAAA;EACA,wBAAA;AC6DA;ADzFA;AAyBA;IAMA,sBAAA;AC8DE;AACF;AD3DA;EACA,mBAAA;EACA,cAAA;EACA,wBAAA;AC8DA;ADpGA;AAmCA;IAMA,gBAAA;AC+DE;AACF;AD5DA;EACA,kBAAA;EACA,cAAA;EACA,cAAA;EACA,cAAA;EACA,kCAAA;EACA,cAAA;EAEA,mBAAA;EACA,gBAAA;EAEA,cAAA;AC6DA;;AAEA,uCAAuC", "file": "StatCard.vue", "sourcesContent": ["<template lang=\"pug\">\n.c-stat-card(:class='`is-${color}`')\n  span.c-stat-desc {{ description }}\n  span.is-title-1.c-stat-value {{ stat }}\n\n  i(:class='`icon-${icon} c-icon`')\n</template>\n\n<script>\nexport default {\n  name: 'StatCard',\n  props: {\n    description: String,\n    stat: [Number, String],\n    icon: {\n      type: String,\n      default: 'chart-bar',\n      required: false\n    },\n    color: {\n      type: String,\n      validator: v => ['blue', 'purple'].includes(v),\n      default: 'blue'\n    }\n  }\n}\n<\/script>\n\n<style lang=\"scss\" scoped>\n@use \"../../../../../src/serve/dashboard/assets/style/_variables.scss\" as *;\n\n.c-stat-card {\n  position: relative;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: stretch;\n  justify-content: flex-end;\n  width: 100%;\n  height: 5.2rem;\n  border-radius: 1rem;\n  padding: 0.75rem 1.5rem;\n  overflow: hidden;\n  box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n\n  @include from($phone_narrow) {\n    max-width: 13.25rem;\n    height: 7rem;\n    padding: 1.25rem 1.5rem;\n  }\n\n  &.is-blue {\n    background-color: $primary_blue;\n  }\n\n  &.is-purple {\n    background-color: $primary_purple;\n  }\n\n  > * {\n    display: inline-block;\n  }\n}\n\n.c-stat-desc {\n  display: inline-block;\n  font-size: $size_5;\n  color: $text_black;\n\n  @include from($phone_narrow) {\n    margin-bottom: 0.25rem;\n  }\n}\n\n.c-stat-value {\n  letter-spacing: 1px;\n  line-height: 1;\n  color: $text_black;\n\n  @include from($phone_narrow) {\n    line-height: 1.2;\n  }\n}\n\n.c-icon {\n  position: absolute;\n  bottom: 0.2rem;\n  right: 0.85rem;\n  display: block;\n  color: var(--stat-card-icon-color);\n  opacity: 0.225;\n  font: {\n    size: 2.875rem;\n    weight: 600;\n  }\n  line-height: 1;\n}\n</style>\n", "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-stat-card {\n  position: relative;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: stretch;\n  justify-content: flex-end;\n  width: 100%;\n  height: 5.2rem;\n  border-radius: 1rem;\n  padding: 0.75rem 1.5rem;\n  overflow: hidden;\n  box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n}\n@media screen and (min-width: 441px) {\n  .c-stat-card {\n    max-width: 13.25rem;\n    height: 7rem;\n    padding: 1.25rem 1.5rem;\n  }\n}\n.c-stat-card.is-blue {\n  background-color: var(--primary_blue);\n}\n.c-stat-card.is-purple {\n  background-color: var(--primary_purple);\n}\n.c-stat-card > * {\n  display: inline-block;\n}\n\n.c-stat-desc {\n  display: inline-block;\n  font-size: 0.875rem;\n  color: var(--text_black);\n}\n@media screen and (min-width: 441px) {\n  .c-stat-desc {\n    margin-bottom: 0.25rem;\n  }\n}\n\n.c-stat-value {\n  letter-spacing: 1px;\n  line-height: 1;\n  color: var(--text_black);\n}\n@media screen and (min-width: 441px) {\n  .c-stat-value {\n    line-height: 1.2;\n  }\n}\n\n.c-icon {\n  position: absolute;\n  bottom: 0.2rem;\n  right: 0.85rem;\n  display: block;\n  color: var(--stat-card-icon-color);\n  opacity: 0.225;\n  font-size: 2.875rem;\n  font-weight: 600;\n  line-height: 1;\n}\n\n/*# sourceMappingURL=StatCard.vue.map */"] }, media: void 0 });
};
var __vue_scope_id__ = "data-v-657f40d0";
var __vue_module_identifier__ = void 0;
var __vue_is_functional_template__ = false;
function __vue_normalize__(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = "<template lang=\"pug\">\n.c-stat-card(:class='`is-${color}`')\n  span.c-stat-desc {{ description }}\n  span.is-title-1.c-stat-value {{ stat }}\n\n  i(:class='`icon-${icon} c-icon`')\n</template>\n\n<script>\nexport default {\n  name: 'StatCard',\n  props: {\n    description: String,\n    stat: [Number, String],\n    icon: {\n      type: String,\n      default: 'chart-bar',\n      required: false\n    },\n    color: {\n      type: String,\n      validator: v => ['blue', 'purple'].includes(v),\n      default: 'blue'\n    }\n  }\n}\n<\/script>\n\n<style lang=\"scss\" scoped>\n@use \"../../../../../src/serve/dashboard/assets/style/_variables.scss\" as *;\n\n.c-stat-card {\n  position: relative;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: stretch;\n  justify-content: flex-end;\n  width: 100%;\n  height: 5.2rem;\n  border-radius: 1rem;\n  padding: 0.75rem 1.5rem;\n  overflow: hidden;\n  box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n\n  @include from($phone_narrow) {\n    max-width: 13.25rem;\n    height: 7rem;\n    padding: 1.25rem 1.5rem;\n  }\n\n  &.is-blue {\n    background-color: $primary_blue;\n  }\n\n  &.is-purple {\n    background-color: $primary_purple;\n  }\n\n  > * {\n    display: inline-block;\n  }\n}\n\n.c-stat-desc {\n  display: inline-block;\n  font-size: $size_5;\n  color: $text_black;\n\n  @include from($phone_narrow) {\n    margin-bottom: 0.25rem;\n  }\n}\n\n.c-stat-value {\n  letter-spacing: 1px;\n  line-height: 1;\n  color: $text_black;\n\n  @include from($phone_narrow) {\n    line-height: 1.2;\n  }\n}\n\n.c-icon {\n  position: absolute;\n  bottom: 0.2rem;\n  right: 0.85rem;\n  display: block;\n  color: var(--stat-card-icon-color);\n  opacity: 0.225;\n  font: {\n    size: 2.875rem;\n    weight: 600;\n  }\n  line-height: 1;\n}\n</style>\n";
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
var StatCard_default = __vue_component__;

export {
  StatCard_default
};
