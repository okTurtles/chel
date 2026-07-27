import {
  StyledInput_default,
  Tooltip_default
} from "./chunk-GYLH73BE.js";
import {
  fakeApplicationOptions
} from "./chunk-HUGS2BMJ.js";
import "./chunk-OID3DFNC.js";
import {
  required,
  validationMixin_default
} from "./chunk-QDEOMRTG.js";
import {
  Dropdown_default
} from "./chunk-RY67CCHC.js";
import {
  PageTemplate_default
} from "./chunk-3KF7JRLD.js";
import {
  L
} from "./chunk-ZI2WDK4P.js";
import "./chunk-UHFMZPCY.js";

// src/serve/dashboard/views/components/InfoCard.vue
var __vue_script__ = {
  name: "InfoCard",
  props: {
    heading: {
      type: String,
      required: false,
      default: ""
    },
    icon: {
      type: String,
      default: "info"
    }
  }
};
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "c-info-card" }, [
    _c("i", { class: "icon-" + _vm.icon + " c-info-card-icon" }),
    _c("div", { staticClass: "c-info-card-content" }, [
      _vm.heading ? _c("h4", { staticClass: "c-info-card-heading is-title-4" }, [
        _vm._v(_vm._s(_vm.heading))
      ]) : _vm._e(),
      _c("div", { staticClass: "c-info-card-body" }, [_vm._t("default")], 2)
    ])
  ]);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
var __vue_inject_styles__ = function(inject) {
  if (!inject) return;
  inject("data-v-4d5c024c_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-4d5c024c]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-4d5c024c] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-info-card[data-v-4d5c024c] {\n  display: flex;\n  align-items: flex-start;\n  width: 100%;\n  padding: 1.25rem 1rem;\n  border: 2px solid var(--info-card-feature-color);\n  border-radius: 0.5rem;\n  background-color: var(--info-card-bg-color);\n}\n.c-info-card-icon[data-v-4d5c024c] {\n  display: inline-block;\n  flex-shrink: 0;\n  margin-right: 0.75rem;\n  font-size: 2rem;\n  line-height: 1.25;\n  font-weight: 600;\n  color: var(--info-card-feature-color);\n}\n.c-info-card-content[data-v-4d5c024c] {\n  flex-grow: 1;\n}\n.c-info-card-heading[data-v-4d5c024c] {\n  margin-top: 0.25rem;\n  margin-bottom: 0.5rem;\n  color: var(--text_0);\n}\n.c-info-card-body[data-v-4d5c024c] {\n  color: var(--text_1);\n  color: var(--info-card-content-color);\n}\n\n/*# sourceMappingURL=InfoCard.vue.map */", map: { "version": 3, "sources": ["src/serve/dashboard/views/components/InfoCard.vue", "InfoCard.vue"], "names": [], "mappings": "AAiCA,sEAAA;AAEA,sBAAA;ACjCA,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;AD7DA;EACA,aAAA;EACA,uBAAA;EACA,WAAA;EACA,qBAAA;EACA,gDAAA;EACA,qBAAA;EACA,2CAAA;ACgEA;AD7DA;EACA,qBAAA;EACA,cAAA;EACA,qBAAA;EACA,eAAA;EACA,iBAAA;EACA,gBAAA;EACA,qCAAA;ACgEA;AD7DA;EACA,YAAA;ACgEA;AD7DA;EACA,mBAAA;EACA,qBAAA;EACA,oBA3BA;AC2FA;AD7DA;EACA,oBA9BA;EA+BA,qCAAA;ACgEA;;AAEA,uCAAuC", "file": "InfoCard.vue", "sourcesContent": [`<template lang="pug">
.c-info-card
  i(:class='\`icon-\${icon} c-info-card-icon\`')

  .c-info-card-content
    h4.c-info-card-heading.is-title-4(v-if='heading') {{ heading }}
    .c-info-card-body
      slot
</template>

<script>
export default {
  name: 'InfoCard',
  props: {
    heading: {
      type: String,
      required: false,
      default: ''
    },
    icon: {
      type: String,
      default: 'info'
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-info-card {
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 1.25rem 1rem;
  border: 2px solid var(--info-card-feature-color);
  border-radius: 0.5rem;
  background-color: var(--info-card-bg-color);
}

.c-info-card-icon {
  display: inline-block;
  flex-shrink: 0;
  margin-right: 0.75rem;
  font-size: 2rem;
  line-height: 1.25;
  font-weight: 600;
  color: var(--info-card-feature-color);
}

.c-info-card-content {
  flex-grow: 1;
}

.c-info-card-heading {
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  color: $text_0;
}

.c-info-card-body {
  color: $text_1;
  color: var(--info-card-content-color);
}
</style>
`, "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-info-card {\n  display: flex;\n  align-items: flex-start;\n  width: 100%;\n  padding: 1.25rem 1rem;\n  border: 2px solid var(--info-card-feature-color);\n  border-radius: 0.5rem;\n  background-color: var(--info-card-bg-color);\n}\n\n.c-info-card-icon {\n  display: inline-block;\n  flex-shrink: 0;\n  margin-right: 0.75rem;\n  font-size: 2rem;\n  line-height: 1.25;\n  font-weight: 600;\n  color: var(--info-card-feature-color);\n}\n\n.c-info-card-content {\n  flex-grow: 1;\n}\n\n.c-info-card-heading {\n  margin-top: 0.25rem;\n  margin-bottom: 0.5rem;\n  color: var(--text_0);\n}\n\n.c-info-card-body {\n  color: var(--text_1);\n  color: var(--info-card-content-color);\n}\n\n/*# sourceMappingURL=InfoCard.vue.map */"] }, media: void 0 });
};
var __vue_scope_id__ = "data-v-4d5c024c";
var __vue_module_identifier__ = void 0;
var __vue_is_functional_template__ = false;
function __vue_normalize__(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang="pug">
.c-info-card
  i(:class='\`icon-\${icon} c-info-card-icon\`')

  .c-info-card-content
    h4.c-info-card-heading.is-title-4(v-if='heading') {{ heading }}
    .c-info-card-body
      slot
</template>

<script>
export default {
  name: 'InfoCard',
  props: {
    heading: {
      type: String,
      required: false,
      default: ''
    },
    icon: {
      type: String,
      default: 'info'
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-info-card {
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 1.25rem 1rem;
  border: 2px solid var(--info-card-feature-color);
  border-radius: 0.5rem;
  background-color: var(--info-card-bg-color);
}

.c-info-card-icon {
  display: inline-block;
  flex-shrink: 0;
  margin-right: 0.75rem;
  font-size: 2rem;
  line-height: 1.25;
  font-weight: 600;
  color: var(--info-card-feature-color);
}

.c-info-card-content {
  flex-grow: 1;
}

.c-info-card-heading {
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  color: $text_0;
}

.c-info-card-body {
  color: $text_1;
  color: var(--info-card-content-color);
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
var InfoCard_default = __vue_component__;

// src/serve/dashboard/views/pages/Accounts.vue
var __vue_script__2 = {
  name: "Accounts",
  mixins: [validationMixin_default],
  components: {
    PageTemplate: PageTemplate_default,
    StyledInput: StyledInput_default,
    Dropdown: Dropdown_default,
    InfoCard: InfoCard_default,
    Tooltip: Tooltip_default
  },
  data() {
    return {
      config: {
        // NOTE: Below are arbitrary values.
        nameMaxChar: 80,
        displayNameMaxChar: 80,
        domainMaxChar: 320
      },
      ephemeral: {
        fakeApplicationOptions
      },
      form: {
        application: null,
        instanceName: "",
        displayName: "",
        domain: "",
        allowUnencryptedData: null
      }
    };
  },
  methods: {
    onDropdownSelect(item) {
      this.form.application = item;
    },
    onCancelClick() {
      this.$router.push({ path: "/main" });
    },
    onSaveClick() {
      this.$v.$touch();
    }
  },
  validations: {
    form: {
      application: { [L("An application has to be selected.")]: required },
      instanceName: { [L("An instance name is required.")]: required },
      displayName: { [L("A display name is required.")]: required },
      domain: { [L("A domain address is required.")]: required }
    }
  }
};
var __vue_render__2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "PageTemplate",
    {
      scopedSlots: _vm._u([
        {
          key: "title",
          fn: function() {
            return [_vm._v(_vm._s(_vm.L("Create a new instance")))];
          },
          proxy: true
        }
      ])
    },
    [
      _c("section", { staticClass: "c-create-instance-section" }, [
        _c(
          "form",
          {
            staticClass: "c-forms",
            on: {
              submit: function($event) {
                $event.preventDefault();
              }
            }
          },
          [
            _c(
              "div",
              { staticClass: "field" },
              [
                _c(
                  "InfoCard",
                  {
                    staticClass: "c-info-card",
                    attrs: { heading: _vm.L("Note") }
                  },
                  [
                    _vm._v(
                      _vm._s(
                        _vm.L(
                          "In order to create a new Application Instance, you\u2019ll need a domain name. If you don\u2019t already have one, you can find an available one and register for a fee with a hosting website and then proceed to create your instance."
                        )
                      )
                    )
                  ]
                )
              ],
              1
            ),
            _c(
              "div",
              { staticClass: "field" },
              [
                _c("i18n", { staticClass: "label", attrs: { tag: "label" } }, [
                  _vm._v("Software / Application")
                ]),
                _c("Dropdown", {
                  directives: [
                    {
                      name: "error",
                      rawName: "v-error:application",
                      arg: "application"
                    }
                  ],
                  staticClass: "c-type-dropdown",
                  class: { "is-error": _vm.$v.form.application.$error },
                  attrs: {
                    options: _vm.ephemeral.fakeApplicationOptions,
                    "disable-click-away": true
                  },
                  on: {
                    select: _vm.onDropdownSelect,
                    blur: function($event) {
                      return _vm.updateField(
                        "application",
                        _vm.form.application
                      );
                    }
                  }
                })
              ],
              1
            ),
            _c(
              "div",
              { staticClass: "field" },
              [
                _c("StyledInput", {
                  directives: [
                    {
                      name: "error",
                      rawName: "v-error:instanceName",
                      arg: "instanceName"
                    }
                  ],
                  class: { "is-error": _vm.$v.form.instanceName.$error },
                  attrs: {
                    label: _vm.L("Instance name"),
                    placeholder: _vm.L("Enter instance name"),
                    max: _vm.config.nameMaxChar
                  },
                  on: {
                    blur: function($event) {
                      return _vm.updateField(
                        "instanceName",
                        _vm.form.instanceName
                      );
                    }
                  },
                  model: {
                    value: _vm.form.instanceName,
                    callback: function($$v) {
                      _vm.$set(_vm.form, "instanceName", $$v);
                    },
                    expression: "form.instanceName"
                  }
                }),
                _c("i18n", { staticClass: "helper c-helper" }, [
                  _vm._v(
                    "A short alphanumeric name to identify your instance internally. It cannot be changed later and must be unique."
                  )
                ])
              ],
              1
            ),
            _c(
              "div",
              { staticClass: "field" },
              [
                _c("StyledInput", {
                  directives: [
                    {
                      name: "error",
                      rawName: "v-error:displayName",
                      arg: "displayName"
                    }
                  ],
                  class: { "is-error": _vm.$v.form.displayName.$error },
                  attrs: {
                    label: _vm.L("Display name"),
                    placeholder: _vm.L("Enter display name"),
                    max: _vm.config.displayNameMaxChar
                  },
                  on: {
                    blur: function($event) {
                      return _vm.updateField(
                        "displayName",
                        _vm.form.displayName
                      );
                    }
                  },
                  model: {
                    value: _vm.form.displayName,
                    callback: function($$v) {
                      _vm.$set(_vm.form, "displayName", $$v);
                    },
                    expression: "form.displayName"
                  }
                }),
                _c("i18n", { staticClass: "helper c-helper" }, [
                  _vm._v("Used on this dashboard to represent your instance.")
                ])
              ],
              1
            ),
            _c(
              "div",
              { staticClass: "field mb-15" },
              [
                _c("StyledInput", {
                  directives: [
                    { name: "error", rawName: "v-error:domain", arg: "domain" }
                  ],
                  class: { "is-error": _vm.$v.form.domain.$error },
                  attrs: {
                    label: _vm.L("Domain"),
                    placeholder: _vm.L("Enter domain"),
                    max: _vm.config.domainMaxChar
                  },
                  on: {
                    blur: function($event) {
                      return _vm.updateField("domain", _vm.form.domain);
                    }
                  },
                  model: {
                    value: _vm.form.domain,
                    callback: function($$v) {
                      _vm.$set(_vm.form, "domain", $$v);
                    },
                    expression: "form.domain"
                  }
                }),
                _c("i18n", { staticClass: "helper c-helper" }, [
                  _vm._v(
                    "The domain name (or subdomain) where you\u2019ll host your instance. It cannot be changed later."
                  )
                ])
              ],
              1
            ),
            _c("fieldset", { staticClass: "field" }, [
              _c(
                "legend",
                { staticClass: "label" },
                [
                  _c("span", [
                    _vm._v(
                      _vm._s(_vm.L("Allow unencrypted data on contracts?"))
                    )
                  ]),
                  _c("tooltip", {
                    staticClass: "c-radio-tooltip",
                    attrs: {
                      content: _vm.L(
                        "If you don't want to moderate public data you should disable unencrypted contract data."
                      ),
                      position: "bottom-right"
                    }
                  })
                ],
                1
              ),
              _c(
                "label",
                { staticClass: "radio" },
                [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.form.allowUnencryptedData,
                        expression: "form.allowUnencryptedData"
                      }
                    ],
                    staticClass: "input",
                    attrs: {
                      type: "radio",
                      name: "allowUnencrypted",
                      value: "yes"
                    },
                    domProps: {
                      checked: _vm._q(_vm.form.allowUnencryptedData, "yes")
                    },
                    on: {
                      change: function($event) {
                        return _vm.$set(_vm.form, "allowUnencryptedData", "yes");
                      }
                    }
                  }),
                  _c("i18n", [_vm._v("Allow unencrypted contracts")])
                ],
                1
              ),
              _c(
                "label",
                { staticClass: "radio" },
                [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.form.allowUnencryptedData,
                        expression: "form.allowUnencryptedData"
                      }
                    ],
                    staticClass: "input",
                    attrs: {
                      type: "radio",
                      name: "allowUnencrypted",
                      value: "no"
                    },
                    domProps: {
                      checked: _vm._q(_vm.form.allowUnencryptedData, "no")
                    },
                    on: {
                      change: function($event) {
                        return _vm.$set(_vm.form, "allowUnencryptedData", "no");
                      }
                    }
                  }),
                  _c("i18n", [_vm._v("Forbid unencrypted data")])
                ],
                1
              )
            ]),
            _c(
              "div",
              { staticClass: "c-btn-container" },
              [
                _c(
                  "i18n",
                  {
                    staticClass: "is-outlined",
                    attrs: { tag: "button" },
                    on: { click: _vm.onCancelClick }
                  },
                  [_vm._v("Cancel")]
                ),
                _c(
                  "i18n",
                  {
                    attrs: { tag: "button", disabled: _vm.$v.form.$invalid },
                    on: { click: _vm.onSaveClick }
                  },
                  [_vm._v("Save")]
                )
              ],
              1
            )
          ]
        )
      ])
    ]
  );
};
var __vue_staticRenderFns__2 = [];
__vue_render__2._withStripped = true;
var __vue_inject_styles__2 = function(inject) {
  if (!inject) return;
  inject("data-v-a3ba23d4_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-a3ba23d4]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-a3ba23d4] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n@media screen and (max-width: 768px) {\n.c-create-instance-section[data-v-a3ba23d4] {\n    max-width: max-content;\n    margin: 0 auto;\n}\n}\n.c-forms[data-v-a3ba23d4] {\n  position: relative;\n}\n.mb-15[data-v-a3ba23d4] {\n  margin-bottom: 1.5rem;\n}\n.c-btn-container[data-v-a3ba23d4] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 2.5rem;\n  padding: 0 0.5rem;\n}\n.c-helper[data-v-a3ba23d4] {\n  padding: 0 0.25rem;\n}\n.c-radio-tooltip[data-v-a3ba23d4] {\n  margin-left: 0.325rem;\n}\n\n/*# sourceMappingURL=Accounts.vue.map */", map: { "version": 3, "sources": ["Accounts.vue", "src/serve/dashboard/views/pages/Accounts.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AACtB,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;AAEA;ACgEA;IAEA,sBAAA;IACA,cAAA;AD/DE;AACF;ACkEA;EACA,kBAAA;AD/DA;ACkEA;EACA,qBAAA;AD/DA;ACkEA;EACA,aAAA;EACA,8BAAA;EACA,mBAAA;EACA,kBAAA;EACA,iBAAA;AD/DA;ACkEA;EACA,kBAAA;AD/DA;ACkEA;EACA,qBAAA;AD/DA;;AAEA,uCAAuC", "file": "Accounts.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n@media screen and (max-width: 768px) {\n  .c-create-instance-section {\n    max-width: max-content;\n    margin: 0 auto;\n  }\n}\n\n.c-forms {\n  position: relative;\n}\n\n.mb-15 {\n  margin-bottom: 1.5rem;\n}\n\n.c-btn-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 2.5rem;\n  padding: 0 0.5rem;\n}\n\n.c-helper {\n  padding: 0 0.25rem;\n}\n\n.c-radio-tooltip {\n  margin-left: 0.325rem;\n}\n\n/*# sourceMappingURL=Accounts.vue.map */", `<template lang='pug'>
PageTemplate
  template(#title='') {{ L('Create a new instance') }}

  section.c-create-instance-section
    form.c-forms(@submit.prevent='')
      .field
        InfoCard.c-info-card(:heading='L("Note")') {{ L("In order to create a new Application Instance, you\u2019ll need a domain name. If you don\u2019t already have one, you can find an available one and register for a fee with a hosting website and then proceed to create your instance.") }}

      .field
        i18n.label(tag='label') Software / Application

        Dropdown.c-type-dropdown(
          :class='{ "is-error": $v.form.application.$error }'
          :options='ephemeral.fakeApplicationOptions'
          v-error:application=''
          :disable-click-away='true'
          @select='onDropdownSelect'
          @blur='updateField("application", form.application)'
        )

      .field
        StyledInput(
          :class='{ "is-error": $v.form.instanceName.$error }'
          v-model='form.instanceName'
          v-error:instanceName=''
          :label='L("Instance name")'
          :placeholder='L("Enter instance name")'
          :max='config.nameMaxChar'
          @blur='updateField("instanceName", form.instanceName)'
        )

        i18n.helper.c-helper A short alphanumeric name to identify your instance internally. It cannot be changed later and must be unique.

      .field
        StyledInput(
          :class='{ "is-error": $v.form.displayName.$error }'
          v-model='form.displayName'
          v-error:displayName=''
          :label='L("Display name")'
          :placeholder='L("Enter display name")'
          :max='config.displayNameMaxChar'
          @blur='updateField("displayName", form.displayName)'
        )

        i18n.helper.c-helper Used on this dashboard to represent your instance.

      .field.mb-15
        StyledInput(
          :class='{ "is-error": $v.form.domain.$error }'
          v-error:domain=''
          v-model='form.domain'
          :label='L("Domain")'
          :placeholder='L("Enter domain")'
          :max='config.domainMaxChar'
          @blur='updateField("domain", form.domain)'
        )

        i18n.helper.c-helper The domain name (or subdomain) where you\u2019ll host your instance. It cannot be changed later.

      fieldset.field
        legend.label
          span {{ L('Allow unencrypted data on contracts?') }}
          tooltip.c-radio-tooltip(
            :content='L("If you don\\'t want to moderate public data you should disable unencrypted contract data.")'
            position='bottom-right'
          )

        label.radio
          input.input(
            type='radio'
            name='allowUnencrypted'
            value='yes'
            v-model='form.allowUnencryptedData'
          )
          i18n Allow unencrypted contracts

        label.radio
          input.input(
            type='radio'
            name='allowUnencrypted'
            value='no'
            v-model='form.allowUnencryptedData'
          )
          i18n Forbid unencrypted data

      .c-btn-container
        i18n.is-outlined(tag='button' @click='onCancelClick') Cancel
        i18n(tag='button' @click='onSaveClick' :disabled='$v.form.$invalid') Save
</template>

<script>
import L from '../../../../../src/serve/dashboard/common/translations.js'
import PageTemplate from './PageTemplate.vue'
import StyledInput from '../../../../../src/serve/dashboard/views/components/forms/StyledInput.vue'
import Dropdown from '../../../../../src/serve/dashboard/views/components/forms/Dropdown.vue'
import InfoCard from '../../../../../src/serve/dashboard/views/components/InfoCard.vue'
import Tooltip from '../../../../../src/serve/dashboard/views/components/Tooltip.vue'
import { fakeApplicationOptions } from '../../../../../src/serve/dashboard/views/utils/dummy-data.js'
import validationMixin from '../../../../../src/serve/dashboard/views/utils/validationMixin.js'
import { required } from '../../../../../src/serve/dashboard/views/utils/validators'

export default {
  name: 'Accounts',
  mixins: [validationMixin],
  components: {
    PageTemplate,
    StyledInput,
    Dropdown,
    InfoCard,
    Tooltip
  },
  data () {
    return {
      config: {
        // NOTE: Below are arbitrary values.
        nameMaxChar: 80,
        displayNameMaxChar: 80,
        domainMaxChar: 320
      },
      ephemeral: {
        fakeApplicationOptions
      },
      form: {
        application: null,
        instanceName: '',
        displayName: '',
        domain: '',
        allowUnencryptedData: null
      }
    }
  },
  methods: {
    onDropdownSelect (item) {
      this.form.application = item
    },
    onCancelClick () {
      this.$router.push({ path: '/main' })
    },
    onSaveClick () {
      this.$v.$touch()
    }
  },
  validations: {
    form: {
      application: { [L('An application has to be selected.')]: required },
      instanceName: { [L('An instance name is required.')]: required },
      displayName: { [L('A display name is required.')]: required },
      domain: { [L('A domain address is required.')]: required }
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-create-instance-section {
  @include phone {
    max-width: max-content;
    margin: 0 auto;
  }
}

.c-forms {
  position: relative;
}

.mb-15 {
  margin-bottom: 1.5rem;
}

.c-btn-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5rem;
  padding: 0 0.5rem;
}

.c-helper {
  padding: 0 0.25rem;
}

.c-radio-tooltip {
  margin-left: 0.325rem;
}
</style>
`] }, media: void 0 });
};
var __vue_scope_id__2 = "data-v-a3ba23d4";
var __vue_module_identifier__2 = void 0;
var __vue_is_functional_template__2 = false;
function __vue_normalize__2(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang='pug'>
PageTemplate
  template(#title='') {{ L('Create a new instance') }}

  section.c-create-instance-section
    form.c-forms(@submit.prevent='')
      .field
        InfoCard.c-info-card(:heading='L("Note")') {{ L("In order to create a new Application Instance, you\u2019ll need a domain name. If you don\u2019t already have one, you can find an available one and register for a fee with a hosting website and then proceed to create your instance.") }}

      .field
        i18n.label(tag='label') Software / Application

        Dropdown.c-type-dropdown(
          :class='{ "is-error": $v.form.application.$error }'
          :options='ephemeral.fakeApplicationOptions'
          v-error:application=''
          :disable-click-away='true'
          @select='onDropdownSelect'
          @blur='updateField("application", form.application)'
        )

      .field
        StyledInput(
          :class='{ "is-error": $v.form.instanceName.$error }'
          v-model='form.instanceName'
          v-error:instanceName=''
          :label='L("Instance name")'
          :placeholder='L("Enter instance name")'
          :max='config.nameMaxChar'
          @blur='updateField("instanceName", form.instanceName)'
        )

        i18n.helper.c-helper A short alphanumeric name to identify your instance internally. It cannot be changed later and must be unique.

      .field
        StyledInput(
          :class='{ "is-error": $v.form.displayName.$error }'
          v-model='form.displayName'
          v-error:displayName=''
          :label='L("Display name")'
          :placeholder='L("Enter display name")'
          :max='config.displayNameMaxChar'
          @blur='updateField("displayName", form.displayName)'
        )

        i18n.helper.c-helper Used on this dashboard to represent your instance.

      .field.mb-15
        StyledInput(
          :class='{ "is-error": $v.form.domain.$error }'
          v-error:domain=''
          v-model='form.domain'
          :label='L("Domain")'
          :placeholder='L("Enter domain")'
          :max='config.domainMaxChar'
          @blur='updateField("domain", form.domain)'
        )

        i18n.helper.c-helper The domain name (or subdomain) where you\u2019ll host your instance. It cannot be changed later.

      fieldset.field
        legend.label
          span {{ L('Allow unencrypted data on contracts?') }}
          tooltip.c-radio-tooltip(
            :content='L("If you don\\'t want to moderate public data you should disable unencrypted contract data.")'
            position='bottom-right'
          )

        label.radio
          input.input(
            type='radio'
            name='allowUnencrypted'
            value='yes'
            v-model='form.allowUnencryptedData'
          )
          i18n Allow unencrypted contracts

        label.radio
          input.input(
            type='radio'
            name='allowUnencrypted'
            value='no'
            v-model='form.allowUnencryptedData'
          )
          i18n Forbid unencrypted data

      .c-btn-container
        i18n.is-outlined(tag='button' @click='onCancelClick') Cancel
        i18n(tag='button' @click='onSaveClick' :disabled='$v.form.$invalid') Save
</template>

<script>
import L from '../../../../../src/serve/dashboard/common/translations.js'
import PageTemplate from './PageTemplate.vue'
import StyledInput from '../../../../../src/serve/dashboard/views/components/forms/StyledInput.vue'
import Dropdown from '../../../../../src/serve/dashboard/views/components/forms/Dropdown.vue'
import InfoCard from '../../../../../src/serve/dashboard/views/components/InfoCard.vue'
import Tooltip from '../../../../../src/serve/dashboard/views/components/Tooltip.vue'
import { fakeApplicationOptions } from '../../../../../src/serve/dashboard/views/utils/dummy-data.js'
import validationMixin from '../../../../../src/serve/dashboard/views/utils/validationMixin.js'
import { required } from '../../../../../src/serve/dashboard/views/utils/validators'

export default {
  name: 'Accounts',
  mixins: [validationMixin],
  components: {
    PageTemplate,
    StyledInput,
    Dropdown,
    InfoCard,
    Tooltip
  },
  data () {
    return {
      config: {
        // NOTE: Below are arbitrary values.
        nameMaxChar: 80,
        displayNameMaxChar: 80,
        domainMaxChar: 320
      },
      ephemeral: {
        fakeApplicationOptions
      },
      form: {
        application: null,
        instanceName: '',
        displayName: '',
        domain: '',
        allowUnencryptedData: null
      }
    }
  },
  methods: {
    onDropdownSelect (item) {
      this.form.application = item
    },
    onCancelClick () {
      this.$router.push({ path: '/main' })
    },
    onSaveClick () {
      this.$v.$touch()
    }
  },
  validations: {
    form: {
      application: { [L('An application has to be selected.')]: required },
      instanceName: { [L('An instance name is required.')]: required },
      displayName: { [L('A display name is required.')]: required },
      domain: { [L('A domain address is required.')]: required }
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-create-instance-section {
  @include phone {
    max-width: max-content;
    margin: 0 auto;
  }
}

.c-forms {
  position: relative;
}

.mb-15 {
  margin-bottom: 1.5rem;
}

.c-btn-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5rem;
  padding: 0 0.5rem;
}

.c-helper {
  padding: 0 0.25rem;
}

.c-radio-tooltip {
  margin-left: 0.325rem;
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
var Accounts_default = __vue_component__2;
export {
  Accounts_default as default
};
