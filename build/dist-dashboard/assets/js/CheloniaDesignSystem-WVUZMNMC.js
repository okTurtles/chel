import {
  StyledInput_default,
  Tooltip_default
} from "./chunk-GYLH73BE.js";
import {
  OPEN_MODAL,
  OPEN_PROMPT
} from "./chunk-JAZDRYJA.js";
import {
  contractDummyData
} from "./chunk-HUGS2BMJ.js";
import "./chunk-OID3DFNC.js";
import "./chunk-ZI2WDK4P.js";
import {
  esm_default
} from "./chunk-UHFMZPCY.js";

// src/serve/dashboard/views/pages/design-system/design-system-content/ContentOutlet.vue
var __vue_script__ = {
  name: "ContentOutlet.vue",
  props: {
    title: String,
    icon: {
      type: String,
      required: false,
      default: "three-circle-plus"
    }
  }
};
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("section", { staticClass: "c-design-system-content" }, [
    _c("div", { staticClass: "c-section-header" }, [
      _c("h3", { staticClass: "is-title-3 c-title" }, [
        _c("i", { staticClass: "icon-info c-title-icon" }),
        _c("span", [_vm._v(_vm._s(_vm.title))])
      ])
    ]),
    _c("div", { staticClass: "c-section-content" }, [_vm._t("default")], 2)
  ]);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
var __vue_inject_styles__ = function(inject) {
  if (!inject) return;
  inject("data-v-aad9084e_0", { source: '/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-aad9084e]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-aad9084e] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-section-header[data-v-aad9084e] {\n  position: relative;\n  margin-bottom: 2.75rem;\n}\n.c-design-system-content[data-v-aad9084e] {\n  position: relative;\n}\n.c-design-system-content[data-v-aad9084e]  .content-unit {\n  position: relative;\n  margin-bottom: 4rem;\n}\n.c-design-system-content[data-v-aad9084e]  .content-unit .unit-name {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  column-gap: 0.75rem;\n  font-size: 1rem;\n  font-weight: bold;\n  line-height: 1.275;\n  letter-spacing: 1px;\n  color: var(--text_0);\n  padding-bottom: 1rem;\n  margin-bottom: 1.75rem;\n}\n.c-design-system-content[data-v-aad9084e]  .content-unit .unit-name:has(+ .unit-description) {\n  margin-bottom: 1rem;\n}\n.c-design-system-content[data-v-aad9084e]  .content-unit .unit-name::after {\n  position: absolute;\n  content: "";\n  display: block;\n  height: 1px;\n  width: 2.75rem;\n  border-bottom: 1px solid var(--text_0);\n  left: 0;\n  bottom: 0;\n  opacity: 0.75;\n}\n.c-design-system-content[data-v-aad9084e]  .content-unit .unit-description {\n  position: relative;\n  padding-left: 1.25rem;\n  color: var(--text_1);\n  font-size: 0.85rem;\n  margin-bottom: 1.75rem;\n}\n.c-design-system-content[data-v-aad9084e]  .content-unit .unit-description::before {\n  content: "->";\n  font-size: 0.875rem;\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.c-design-system-content[data-v-aad9084e]  .content-unit .unit-description .pill,\n.c-design-system-content[data-v-aad9084e]  .content-unit .unit-description strong {\n  margin: 0 0.25rem;\n}\n.c-design-system-content[data-v-aad9084e]  .content-unit .unit-description strong {\n  color: var(--text_0);\n}\n.c-title[data-v-aad9084e] {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.c-title-icon[data-v-aad9084e] {\n  display: inline-flex;\n  align-items: center;\n  transform: translateY(1px);\n  font-size: 1.125em;\n  margin-right: 0.25rem;\n}\n\n/*# sourceMappingURL=ContentOutlet.vue.map */', map: { "version": 3, "sources": ["src/serve/dashboard/views/pages/design-system/design-system-content/ContentOutlet.vue", "ContentOutlet.vue"], "names": [], "mappings": "AAiCA,sEAAA;AChCA,sBAAsB;AD6GtB,qBAAA;AC3GA;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;AD/DA;EACA,kBAAA;EACA,sBAAA;ACkEA;AD/DA;EACA,kBAAA;ACkEA;ADhEA;EACA,kBAAA;EACA,mBAAA;ACkEA;ADhEA;EACA,kBAAA;EACA,oBAAA;EACA,mBAAA;EACA,mBAAA;EACA,eAAA;EACA,iBAAA;EACA,kBAAA;EACA,mBAAA;EACA,oBAnBA;EAoBA,oBAAA;EACA,sBAAA;ACkEA;ADhEA;EACA,mBAAA;ACkEA;AD/DA;EACA,kBAAA;EACA,WAAA;EACA,cAAA;EACA,WAAA;EACA,cAAA;EACA,sCAAA;EACA,OAAA;EACA,SAAA;EACA,aAAA;ACiEA;AD7DA;EACA,kBAAA;EACA,qBAAA;EACA,oBA1CA;EA2CA,kBAAA;EACA,sBAAA;AC+DA;AD7DA;EACA,aAAA;EACA,mBAAA;EACA,cAAA;EACA,kBAAA;EACA,MAAA;EACA,OAAA;AC+DA;AD5DA;;EAEA,iBAAA;AC8DA;AD3DA;EACA,oBA9DA;AC2HA;ADvDA;EACA,kBAAA;EACA,aAAA;EACA,mBAAA;AC0DA;ADxDA;EACA,oBAAA;EACA,mBAAA;EACA,0BAAA;EACA,kBAAA;EACA,qBAAA;AC0DA;;AAEA,4CAA4C", "file": "ContentOutlet.vue", "sourcesContent": [`<template lang="pug">
section.c-design-system-content
  .c-section-header
    h3.is-title-3.c-title
      i.icon-info.c-title-icon
      span {{ title }}

  .c-section-content
    slot
</template>

<script>
export default {
  name: 'ContentOutlet.vue',
  props: {
    title: String,
    icon: {
      type: String,
      required: false,
      default: 'three-circle-plus'
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-section-header {
  position: relative;
  margin-bottom: 2.75rem;
}

.c-design-system-content {
  position: relative;

  ::v-deep .content-unit {
    position: relative;
    margin-bottom: 4rem;

    .unit-name {
      position: relative;
      display: inline-flex;
      align-items: center;
      column-gap: 0.75rem;
      font-size: 1rem;
      font-weight: bold;
      line-height: 1.275;
      letter-spacing: 1px;
      color: $text_0;
      padding-bottom: 1rem;
      margin-bottom: 1.75rem;

      &:has(+ .unit-description) {
        margin-bottom: 1rem;
      }

      &::after {
        position: absolute;
        content: "";
        display: block;
        height: 1px;
        width: 2.75rem;
        border-bottom: 1px solid $text_0;
        left: 0;
        bottom: 0;
        opacity: 0.75;
      }
    }

    .unit-description {
      position: relative;
      padding-left: 1.25rem;
      color: $text_1;
      font-size: 0.85rem;
      margin-bottom: 1.75rem;

      &::before {
        content: "->";
        font-size: $size_5;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
      }

      .pill,
      strong {
        margin: 0 0.25rem;
      }

      strong {
        color: $text_0;
      }
    }
  }
}

.c-title {
  position: relative;
  display: flex;
  align-items: center;

  &-icon {
    display: inline-flex;
    align-items: center;
    transform: translateY(1px);
    font-size: 1.125em;
    margin-right: 0.25rem;
  }
}
</style>
`, '/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-section-header {\n  position: relative;\n  margin-bottom: 2.75rem;\n}\n\n.c-design-system-content {\n  position: relative;\n}\n.c-design-system-content ::v-deep .content-unit {\n  position: relative;\n  margin-bottom: 4rem;\n}\n.c-design-system-content ::v-deep .content-unit .unit-name {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  column-gap: 0.75rem;\n  font-size: 1rem;\n  font-weight: bold;\n  line-height: 1.275;\n  letter-spacing: 1px;\n  color: var(--text_0);\n  padding-bottom: 1rem;\n  margin-bottom: 1.75rem;\n}\n.c-design-system-content ::v-deep .content-unit .unit-name:has(+ .unit-description) {\n  margin-bottom: 1rem;\n}\n.c-design-system-content ::v-deep .content-unit .unit-name::after {\n  position: absolute;\n  content: "";\n  display: block;\n  height: 1px;\n  width: 2.75rem;\n  border-bottom: 1px solid var(--text_0);\n  left: 0;\n  bottom: 0;\n  opacity: 0.75;\n}\n.c-design-system-content ::v-deep .content-unit .unit-description {\n  position: relative;\n  padding-left: 1.25rem;\n  color: var(--text_1);\n  font-size: 0.85rem;\n  margin-bottom: 1.75rem;\n}\n.c-design-system-content ::v-deep .content-unit .unit-description::before {\n  content: "->";\n  font-size: 0.875rem;\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.c-design-system-content ::v-deep .content-unit .unit-description .pill,\n.c-design-system-content ::v-deep .content-unit .unit-description strong {\n  margin: 0 0.25rem;\n}\n.c-design-system-content ::v-deep .content-unit .unit-description strong {\n  color: var(--text_0);\n}\n\n.c-title {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.c-title-icon {\n  display: inline-flex;\n  align-items: center;\n  transform: translateY(1px);\n  font-size: 1.125em;\n  margin-right: 0.25rem;\n}\n\n/*# sourceMappingURL=ContentOutlet.vue.map */'] }, media: void 0 });
};
var __vue_scope_id__ = "data-v-aad9084e";
var __vue_module_identifier__ = void 0;
var __vue_is_functional_template__ = false;
function __vue_normalize__(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang="pug">
section.c-design-system-content
  .c-section-header
    h3.is-title-3.c-title
      i.icon-info.c-title-icon
      span {{ title }}

  .c-section-content
    slot
</template>

<script>
export default {
  name: 'ContentOutlet.vue',
  props: {
    title: String,
    icon: {
      type: String,
      required: false,
      default: 'three-circle-plus'
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-section-header {
  position: relative;
  margin-bottom: 2.75rem;
}

.c-design-system-content {
  position: relative;

  ::v-deep .content-unit {
    position: relative;
    margin-bottom: 4rem;

    .unit-name {
      position: relative;
      display: inline-flex;
      align-items: center;
      column-gap: 0.75rem;
      font-size: 1rem;
      font-weight: bold;
      line-height: 1.275;
      letter-spacing: 1px;
      color: $text_0;
      padding-bottom: 1rem;
      margin-bottom: 1.75rem;

      &:has(+ .unit-description) {
        margin-bottom: 1rem;
      }

      &::after {
        position: absolute;
        content: "";
        display: block;
        height: 1px;
        width: 2.75rem;
        border-bottom: 1px solid $text_0;
        left: 0;
        bottom: 0;
        opacity: 0.75;
      }
    }

    .unit-description {
      position: relative;
      padding-left: 1.25rem;
      color: $text_1;
      font-size: 0.85rem;
      margin-bottom: 1.75rem;

      &::before {
        content: "->";
        font-size: $size_5;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
      }

      .pill,
      strong {
        margin: 0 0.25rem;
      }

      strong {
        color: $text_0;
      }
    }
  }
}

.c-title {
  position: relative;
  display: flex;
  align-items: center;

  &-icon {
    display: inline-flex;
    align-items: center;
    transform: translateY(1px);
    font-size: 1.125em;
    margin-right: 0.25rem;
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
var ContentOutlet_default = __vue_component__;

// src/serve/dashboard/views/pages/design-system/design-system-content/TableTemplate.vue
var __vue_script__2 = {
  name: "TableTemplate"
};
var __vue_render__2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "table",
    { staticClass: "table c-table" },
    [
      _c("div", { staticClass: "c-table-header__mobile" }, [
        _vm._v("Code / Demo")
      ]),
      _vm._m(0),
      _vm._t("default")
    ],
    2
  );
};
var __vue_staticRenderFns__2 = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("thead", { staticClass: "c-table-header__non-mobile" }, [
      _c("th", [_vm._v("code")]),
      _c("th", [_vm._v("demo")])
    ]);
  }
];
__vue_render__2._withStripped = true;
var __vue_inject_styles__2 = function(inject) {
  if (!inject) return;
  inject("data-v-acfb48f6_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-acfb48f6]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-acfb48f6] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-table[data-v-acfb48f6] {\n  display: table;\n  width: 100%;\n  max-width: 800px;\n  margin-top: 2rem;\n  margin-bottom: 2rem;\n  border-spacing: 0 1rem;\n  border-bottom: 1px solid var(--border);\n  padding-bottom: 2rem;\n}\n.c-table thead[data-v-acfb48f6] {\n  position: relative;\n  display: none;\n  letter-spacing: 1px;\n  border-bottom: 1px solid var(--border);\n  text-transform: capitalize;\n}\n.c-table thead th[data-v-acfb48f6] {\n  font-size: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n@media screen and (min-width: 600px) {\n.c-table thead[data-v-acfb48f6] {\n    display: table-header-group;\n}\n}\n.c-table tr[data-v-acfb48f6] {\n  height: auto;\n  vertical-align: baseline;\n}\n.c-table .c-table-header__mobile[data-v-acfb48f6] {\n  display: block;\n  font-size: 0.75rem;\n  font-weight: bold;\n  letter-spacing: 1px;\n  border-bottom: 1px solid var(--border);\n  padding-bottom: 1rem;\n  width: 100%;\n}\n@media screen and (min-width: 600px) {\n.c-table .c-table-header__mobile[data-v-acfb48f6] {\n    display: none;\n}\n}\n\n/*# sourceMappingURL=TableTemplate.vue.map */", map: { "version": 3, "sources": ["src/serve/dashboard/views/pages/design-system/design-system-content/TableTemplate.vue", "TableTemplate.vue"], "names": [], "mappings": "AAiCA,sEAAA;AAEA,sBAAA;ACjCA,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;ADlEA;EACA,cAAA;EACA,WAAA;EACA,gBAAA;EACA,gBAAA;EACA,mBAAA;EACA,sBAAA;EACA,sCAAA;EACA,oBAAA;ACqEA;ADnEA;EACA,kBAAA;EACA,aAAA;EACA,mBAAA;EACA,sCAAA;EACA,0BAAA;ACqEA;ADnEA;EACA,kBAAA;EACA,uBAAA;ACqEA;AD7FA;AAeA;IAaA,2BAAA;ACqEE;AACF;ADlEA;EACA,YAAA;EACA,wBAAA;ACoEA;ADjEA;EACA,cAAA;EACA,kBAAA;EACA,iBAAA;EACA,mBAAA;EACA,sCAAA;EACA,oBAAA;EACA,WAAA;ACmEA;AD/GA;AAqCA;IAUA,aAAA;ACoEE;AACF;;AAEA,4CAA4C", "file": "TableTemplate.vue", "sourcesContent": [`<template lang='pug'>
table.table.c-table
  .c-table-header__mobile Code / Demo
  thead.c-table-header__non-mobile
    th code
    th demo

  slot
</template>

<script>
export default {
  name: 'TableTemplate'
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

@mixin from600 {
  @media screen and (min-width: 600px) {
    @content;
  }
}

.c-table {
  display: table;
  width: 100%;
  max-width: 800px;
  margin-top: 2rem;
  margin-bottom: 2rem;
  border-spacing: 0 1rem;
  border-bottom: 1px solid $border;
  padding-bottom: 2rem;

  thead {
    position: relative;
    display: none;
    letter-spacing: 1px;
    border-bottom: 1px solid $border;
    text-transform: capitalize;

    th {
      font-size: 0.75rem;
      padding-bottom: 0.75rem;
    }

    @include from600 {
      display: table-header-group;
    }
  }

  tr {
    height: auto;
    vertical-align: baseline;
  }

  .c-table-header__mobile {
    display: block;
    font-size: 0.75rem;
    font-weight: bold;
    letter-spacing: 1px;
    border-bottom: 1px solid $border;
    padding-bottom: 1rem;
    width: 100%;

    @include from600 {
      display: none;
    }
  }
}
</style>
`, "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-table {\n  display: table;\n  width: 100%;\n  max-width: 800px;\n  margin-top: 2rem;\n  margin-bottom: 2rem;\n  border-spacing: 0 1rem;\n  border-bottom: 1px solid var(--border);\n  padding-bottom: 2rem;\n}\n.c-table thead {\n  position: relative;\n  display: none;\n  letter-spacing: 1px;\n  border-bottom: 1px solid var(--border);\n  text-transform: capitalize;\n}\n.c-table thead th {\n  font-size: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n@media screen and (min-width: 600px) {\n  .c-table thead {\n    display: table-header-group;\n  }\n}\n.c-table tr {\n  height: auto;\n  vertical-align: baseline;\n}\n.c-table .c-table-header__mobile {\n  display: block;\n  font-size: 0.75rem;\n  font-weight: bold;\n  letter-spacing: 1px;\n  border-bottom: 1px solid var(--border);\n  padding-bottom: 1rem;\n  width: 100%;\n}\n@media screen and (min-width: 600px) {\n  .c-table .c-table-header__mobile {\n    display: none;\n  }\n}\n\n/*# sourceMappingURL=TableTemplate.vue.map */"] }, media: void 0 });
};
var __vue_scope_id__2 = "data-v-acfb48f6";
var __vue_module_identifier__2 = void 0;
var __vue_is_functional_template__2 = false;
function __vue_normalize__2(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang='pug'>
table.table.c-table
  .c-table-header__mobile Code / Demo
  thead.c-table-header__non-mobile
    th code
    th demo

  slot
</template>

<script>
export default {
  name: 'TableTemplate'
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

@mixin from600 {
  @media screen and (min-width: 600px) {
    @content;
  }
}

.c-table {
  display: table;
  width: 100%;
  max-width: 800px;
  margin-top: 2rem;
  margin-bottom: 2rem;
  border-spacing: 0 1rem;
  border-bottom: 1px solid $border;
  padding-bottom: 2rem;

  thead {
    position: relative;
    display: none;
    letter-spacing: 1px;
    border-bottom: 1px solid $border;
    text-transform: capitalize;

    th {
      font-size: 0.75rem;
      padding-bottom: 0.75rem;
    }

    @include from600 {
      display: table-header-group;
    }
  }

  tr {
    height: auto;
    vertical-align: baseline;
  }

  .c-table-header__mobile {
    display: block;
    font-size: 0.75rem;
    font-weight: bold;
    letter-spacing: 1px;
    border-bottom: 1px solid $border;
    padding-bottom: 1rem;
    width: 100%;

    @include from600 {
      display: none;
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
var TableTemplate_default = __vue_component__2;

// src/serve/dashboard/views/pages/design-system/design-system-content/TableRow.vue
var __vue_script__3 = {
  name: "TableRow",
  props: {
    code: {
      type: String,
      required: false
    }
  }
};
var __vue_render__3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("tr", { staticClass: "c-row" }, [
    _c("div", { staticClass: "c-combined-cell" }, [
      _c("div", { staticClass: "c-code-row" }, [_vm._v(_vm._s(_vm.code))]),
      _c("div", { staticClass: "c-demo-row" }, [_vm._t("default")], 2)
    ]),
    _c(
      "td",
      { staticClass: "c-td-code" },
      [_vm.code ? _c("span", [_vm._v(_vm._s(_vm.code))]) : _vm._t("code")],
      2
    ),
    _c("td", { staticClass: "c-td-demo" }, [_vm._t("default")], 2)
  ]);
};
var __vue_staticRenderFns__3 = [];
__vue_render__3._withStripped = true;
var __vue_inject_styles__3 = function(inject) {
  if (!inject) return;
  inject("data-v-ad6e6240_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-ad6e6240]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-ad6e6240] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-combined-cell[data-v-ad6e6240] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  row-gap: 0.75rem;\n  padding: 0.75rem 0.5rem;\n  border-bottom: 1px solid var(--border);\n  width: 100%;\n}\n.c-combined-cell .c-code-row[data-v-ad6e6240] {\n  font-size: 0.875rem;\n  color: var(--styled-input-label-color);\n  padding-right: 0.5rem;\n}\n.c-combined-cell .c-demo-row[data-v-ad6e6240] {\n  position: relative;\n  width: 100%;\n}\n@media screen and (min-width: 600px) {\n.c-combined-cell[data-v-ad6e6240] {\n    display: none;\n}\n}\n.c-td-code[data-v-ad6e6240],\n.c-td-demo[data-v-ad6e6240] {\n  display: none;\n  padding: 0.75rem 0;\n  line-height: 1.25;\n}\n@media screen and (min-width: 600px) {\n.c-td-code[data-v-ad6e6240],\n  .c-td-demo[data-v-ad6e6240] {\n    display: table-cell;\n}\n}\n.c-td-code[data-v-ad6e6240] {\n  font-size: 0.875rem;\n  color: var(--styled-input-label-color);\n  padding-right: 0.5rem;\n}\n@media screen and (min-width: 769px) {\n.c-td-code[data-v-ad6e6240] {\n    width: 360px;\n}\n}\n\n/*# sourceMappingURL=TableRow.vue.map */", map: { "version": 3, "sources": ["src/serve/dashboard/views/pages/design-system/design-system-content/TableRow.vue", "TableRow.vue"], "names": [], "mappings": "AAiCA,sEAAA;AAEA,sBAAA;ACjCA,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;ADlDA;EACA,kBAAA;EACA,aAAA;EACA,sBAAA;EACA,uBAAA;EACA,gBAAA;EACA,uBAAA;EACA,sCAAA;EACA,WAAA;ACqDA;ADnDA;EAfA,mBAAA;EACA,sCAAA;EACA,qBAAA;ACqEA;ADpDA;EACA,kBAAA;EACA,WAAA;ACsDA;ADjFA;AAWA;IAoBA,aAAA;ACsDE;AACF;ADnDA;;EAEA,aAAA;EACA,kBAAA;EACA,iBAAA;ACsDA;AD7FA;AAmCA;;IAOA,mBAAA;ACwDE;AACF;ADrDA;EAxCA,mBAAA;EACA,sCAAA;EACA,qBAAA;ACiGA;ADjGA;AAsCA;IAIA,YAAA;AC2DE;AACF;;AAEA,uCAAuC", "file": "TableRow.vue", "sourcesContent": [`<template lang='pug'>
tr.c-row
  .c-combined-cell
    .c-code-row {{ code }}
    .c-demo-row
      slot

  td.c-td-code
    span(v-if='code') {{ code }}
    slot(v-else name='code')
  td.c-td-demo
    slot
</template>

<script>
export default {
  name: 'TableRow',
  props: {
    code: {
      type: String,
      required: false
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

@mixin from600 {
  @media screen and (min-width: 600px) {
    @content;
  }
}

@mixin code-style-common {
  font-size: $size_5;
  color: var(--styled-input-label-color);
  padding-right: 0.5rem;
}

.c-combined-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 0.75rem;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid $border;
  width: 100%;

  .c-code-row {
    @include code-style-common;
  }

  .c-demo-row {
    position: relative;
    width: 100%;
  }

  @include from600 {
    display: none;
  }
}

.c-td-code,
.c-td-demo {
  display: none;
  padding: 0.75rem 0;
  line-height: 1.25;

  @include from600 {
    display: table-cell;
  }
}

.c-td-code {
  @include code-style-common;

  @include from ($tablet) {
    width: 360px;
  }
}
</style>
`, "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-combined-cell {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  row-gap: 0.75rem;\n  padding: 0.75rem 0.5rem;\n  border-bottom: 1px solid var(--border);\n  width: 100%;\n}\n.c-combined-cell .c-code-row {\n  font-size: 0.875rem;\n  color: var(--styled-input-label-color);\n  padding-right: 0.5rem;\n}\n.c-combined-cell .c-demo-row {\n  position: relative;\n  width: 100%;\n}\n@media screen and (min-width: 600px) {\n  .c-combined-cell {\n    display: none;\n  }\n}\n\n.c-td-code,\n.c-td-demo {\n  display: none;\n  padding: 0.75rem 0;\n  line-height: 1.25;\n}\n@media screen and (min-width: 600px) {\n  .c-td-code,\n  .c-td-demo {\n    display: table-cell;\n  }\n}\n\n.c-td-code {\n  font-size: 0.875rem;\n  color: var(--styled-input-label-color);\n  padding-right: 0.5rem;\n}\n@media screen and (min-width: 769px) {\n  .c-td-code {\n    width: 360px;\n  }\n}\n\n/*# sourceMappingURL=TableRow.vue.map */"] }, media: void 0 });
};
var __vue_scope_id__3 = "data-v-ad6e6240";
var __vue_module_identifier__3 = void 0;
var __vue_is_functional_template__3 = false;
function __vue_normalize__3(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang='pug'>
tr.c-row
  .c-combined-cell
    .c-code-row {{ code }}
    .c-demo-row
      slot

  td.c-td-code
    span(v-if='code') {{ code }}
    slot(v-else name='code')
  td.c-td-demo
    slot
</template>

<script>
export default {
  name: 'TableRow',
  props: {
    code: {
      type: String,
      required: false
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

@mixin from600 {
  @media screen and (min-width: 600px) {
    @content;
  }
}

@mixin code-style-common {
  font-size: $size_5;
  color: var(--styled-input-label-color);
  padding-right: 0.5rem;
}

.c-combined-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 0.75rem;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid $border;
  width: 100%;

  .c-code-row {
    @include code-style-common;
  }

  .c-demo-row {
    position: relative;
    width: 100%;
  }

  @include from600 {
    display: none;
  }
}

.c-td-code,
.c-td-demo {
  display: none;
  padding: 0.75rem 0;
  line-height: 1.25;

  @include from600 {
    display: table-cell;
  }
}

.c-td-code {
  @include code-style-common;

  @include from ($tablet) {
    width: 360px;
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
var TableRow_default = __vue_component__3;

// src/serve/dashboard/views/pages/design-system/design-system-content/ChelTypography.vue
var __vue_script__4 = {
  name: "ChelTypography",
  components: {
    ContentOutlet: ContentOutlet_default,
    TableTemplate: TableTemplate_default,
    TableRow: TableRow_default
  }
};
var __vue_render__4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("content-outlet", { attrs: { title: "Typography" } }, [
    _c(
      "div",
      { staticClass: "content-unit" },
      [
        _c("h4", { staticClass: "unit-name" }, [_vm._v("Various text styles")]),
        _c("div", { staticClass: "unit-description" }, [
          _vm._v(
            "There are various text-style related css classes that are used across the app. Feel free to extend"
          ),
          _c("span", { staticClass: "pill is-purple-1" }, [
            _vm._v("_typography.scss")
          ]),
          _vm._v("file to define other useful text-related styles.")
        ]),
        _c(
          "table-template",
          [
            _c("table-row", { attrs: { code: ".is-title-1" } }, [
              _c("h1", { staticClass: "is-title-1" }, [_vm._v("is-title-1")])
            ]),
            _c("table-row", { attrs: { code: ".is-title-2" } }, [
              _c("h1", { staticClass: "is-title-2" }, [_vm._v("is-title-2")])
            ]),
            _c("table-row", { attrs: { code: ".is-title-3" } }, [
              _c("h1", { staticClass: "is-title-2" }, [_vm._v("is-title-3")])
            ]),
            _c("table-row", { attrs: { code: ".is-title-4" } }, [
              _c("h1", { staticClass: "is-title-2" }, [_vm._v("is-title-4")])
            ]),
            _c("table-row", { attrs: { code: ".has-text-bold" } }, [
              _c("span", { staticClass: "has-text-bold" }, [
                _vm._v("has-text-bold")
              ])
            ]),
            _c("table-row", { attrs: { code: ".has-text-color-1" } }, [
              _c("span", { staticClass: "has-text-color-1" }, [
                _vm._v("has-text-color-1")
              ])
            ]),
            _c("table-row", { attrs: { code: ".has-text-danger" } }, [
              _c("span", { staticClass: "has-text-danger" }, [
                _vm._v("has-text-danger")
              ])
            ]),
            _c("table-row", { attrs: { code: ".has-text-warning" } }, [
              _c("span", { staticClass: "has-text-warning" }, [
                _vm._v("has-text-warning")
              ])
            ]),
            _c("table-row", { attrs: { code: ".has-family-poppins" } }, [
              _c("span", { staticClass: "has-family-poppins" }, [
                _vm._v("has-family-poppins")
              ])
            ]),
            _c("table-row", { attrs: { code: ".link" } }, [
              _c("a", { staticClass: "link" }, [
                _vm._v("https://groupincome.org/")
              ])
            ])
          ],
          1
        )
      ],
      1
    ),
    _c(
      "div",
      { staticClass: "content-unit" },
      [
        _c("h4", { staticClass: "unit-name" }, [_vm._v("Pills")]),
        _c("div", { staticClass: "unit-description" }, [
          _vm._v("Check out"),
          _c("span", { staticClass: "pill is-purple-1" }, [
            _vm._v("_pills.scss")
          ]),
          _vm._v("file for the css details.")
        ]),
        _c(
          "table-template",
          { staticClass: "mt-0" },
          [
            _c("table-row", { attrs: { code: ".pill.is-neautral" } }, [
              _c("span", { staticClass: "pill is-neautral" }, [
                _vm._v("neutral")
              ])
            ]),
            _c("table-row", { attrs: { code: ".pill.is-danger" } }, [
              _c("span", { staticClass: "pill is-danger" }, [_vm._v("danger")])
            ]),
            _c("table-row", { attrs: { code: ".pill.is-warning" } }, [
              _c("span", { staticClass: "pill is-warning" }, [
                _vm._v("warning")
              ])
            ]),
            _c("table-row", { attrs: { code: ".pill.is-purple-1" } }, [
              _c("span", { staticClass: "pill is-purple-1" }, [
                _vm._v("purple-1")
              ])
            ]),
            _c("table-row", { attrs: { code: ".pill.is-blue-1" } }, [
              _c("span", { staticClass: "pill is-blue-1" }, [_vm._v("blue-1")])
            ]),
            _c("table-row", { attrs: { code: ".pill.is-green-1" } }, [
              _c("span", { staticClass: "pill is-green-1" }, [
                _vm._v("green-1")
              ])
            ])
          ],
          1
        )
      ],
      1
    ),
    _c("div", { staticClass: "content-unit" }, [
      _c("h4", { staticClass: "unit-name" }, [_vm._v("TBD...")]),
      _c("div", { staticClass: "unit-description" }, [_vm._v("TBD...")])
    ])
  ]);
};
var __vue_staticRenderFns__4 = [];
__vue_render__4._withStripped = true;
var __vue_inject_styles__4 = function(inject) {
  if (!inject) return;
  inject("data-v-232006c7_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-232006c7]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-232006c7] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n/*# sourceMappingURL=ChelTypography.vue.map */", map: { "version": 3, "sources": ["ChelTypography.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AACtB,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;;AAEA,6CAA6C", "file": "ChelTypography.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n/*# sourceMappingURL=ChelTypography.vue.map */"] }, media: void 0 });
};
var __vue_scope_id__4 = "data-v-232006c7";
var __vue_module_identifier__4 = void 0;
var __vue_is_functional_template__4 = false;
function __vue_normalize__4(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang="pug">
content-outlet(title='Typography')
  .content-unit
    h4.unit-name Various text styles

    .unit-description
      | There are various text-style related css classes that are used across the app. Feel free to extend
      span.pill.is-purple-1 _typography.scss
      | file to define other useful text-related styles.

    table-template
      table-row(code='.is-title-1')
        h1.is-title-1 is-title-1
      table-row(code='.is-title-2')
        h1.is-title-2 is-title-2
      table-row(code='.is-title-3')
        h1.is-title-2 is-title-3
      table-row(code='.is-title-4')
        h1.is-title-2 is-title-4
      table-row(code='.has-text-bold')
        span.has-text-bold has-text-bold
      table-row(code='.has-text-color-1')
        span.has-text-color-1 has-text-color-1
      table-row(code='.has-text-danger')
        span.has-text-danger has-text-danger
      table-row(code='.has-text-warning')
        span.has-text-warning has-text-warning
      table-row(code='.has-family-poppins')
        span.has-family-poppins has-family-poppins
      table-row(code='.link')
        a.link https://groupincome.org/

  .content-unit
    h4.unit-name Pills

    .unit-description
      | Check out
      span.pill.is-purple-1 _pills.scss
      | file for the css details.

    table-template.mt-0
      table-row(code='.pill.is-neautral')
        span.pill.is-neautral neutral
      table-row(code='.pill.is-danger')
        span.pill.is-danger danger
      table-row(code='.pill.is-warning')
        span.pill.is-warning warning
      table-row(code='.pill.is-purple-1')
        span.pill.is-purple-1 purple-1
      table-row(code='.pill.is-blue-1')
        span.pill.is-blue-1 blue-1
      table-row(code='.pill.is-green-1')
        span.pill.is-green-1 green-1

  .content-unit
    h4.unit-name TBD...

    .unit-description TBD...
</template>

<script>
import ContentOutlet from './ContentOutlet.vue'
import TableTemplate from './TableTemplate.vue'
import TableRow from './TableRow.vue'

export default {
  name: 'ChelTypography',
  components: {
    ContentOutlet,
    TableTemplate,
    TableRow
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;
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
function __vue_create_injector__4() {
  const styles = __vue_create_injector__4.styles || (__vue_create_injector__4.styles = {});
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
var __vue_component__4 = /* @__PURE__ */ __vue_normalize__4(
  { render: __vue_render__4, staticRenderFns: __vue_staticRenderFns__4 },
  __vue_inject_styles__4,
  __vue_script__4,
  __vue_scope_id__4,
  __vue_is_functional_template__4,
  __vue_module_identifier__4,
  false,
  __vue_create_injector__4,
  void 0,
  void 0
);
var ChelTypography_default = __vue_component__4;

// src/serve/dashboard/views/components/forms/ToggleSwitch.vue
var __vue_script__5 = {
  name: "ToggleSwitch",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    disabled: Boolean,
    loading: Boolean
  },
  methods: {
    onChange() {
      this.$emit("input", !this.value);
    }
  }
};
var __vue_render__5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "switch-toggle",
      class: { "is-disabled": _vm.disabled || _vm.loading, "is-on": _vm.value }
    },
    [
      _c("input", {
        staticClass: "toggle-input",
        attrs: { type: "checkbox" },
        domProps: { checked: _vm.value },
        on: { change: _vm.onChange }
      }),
      _vm._m(0)
    ]
  );
};
var __vue_staticRenderFns__5 = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("span", { staticClass: "toggle-track" }, [
      _c("span", { staticClass: "toggle-thumb" })
    ]);
  }
];
__vue_render__5._withStripped = true;
var __vue_inject_styles__5 = function(inject) {
  if (!inject) return;
  inject("data-v-2fb560dc_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-2fb560dc]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-2fb560dc] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.switch-toggle[data-v-2fb560dc] {\n  position: relative;\n  display: inline-flex;\n  height: auto;\n  width: max-content;\n  padding: 0.25rem;\n  border-radius: 2rem;\n  border: 1px solid var(--toggle-switch-border-color);\n  background-color: var(--toggle-switch-bg-color);\n  transition: all 120ms ease-out;\n}\n.switch-toggle input.toggle-input[data-v-2fb560dc] {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  cursor: pointer;\n  z-index: 1;\n}\n.switch-toggle .toggle-track[data-v-2fb560dc] {\n  position: relative;\n  display: inline-block;\n  width: 2.625rem;\n  height: 1.25rem;\n}\n.switch-toggle .toggle-thumb[data-v-2fb560dc] {\n  position: absolute;\n  width: 1.25rem;\n  height: 1.25rem;\n  top: 0;\n  left: 0;\n  border-radius: 50%;\n  background-color: var(--toggle-switch-thumb-color);\n  transition: all 120ms ease-out;\n  transform: translateX(0);\n}\n.switch-toggle.is-on[data-v-2fb560dc] {\n  background-color: var(--toggle-switch-bg-color_active);\n}\n.switch-toggle.is-on .toggle-thumb[data-v-2fb560dc] {\n  transform: translateX(100%);\n}\n.switch-toggle.is-disabled[data-v-2fb560dc] {\n  opacity: 0.425;\n  pointer-events: none;\n}\n.switch-toggle[data-v-2fb560dc]:hover, .switch-toggle[data-v-2fb560dc]:focus {\n  border-color: var(--toggle-switch-border-color_focus);\n}\n:root[data-theme=dark] .switch-toggle.is-disabled[data-v-2fb560dc] {\n  opacity: 0.57;\n}\n\n/*# sourceMappingURL=ToggleSwitch.vue.map */", map: { "version": 3, "sources": ["src/serve/dashboard/views/components/forms/ToggleSwitch.vue", "ToggleSwitch.vue"], "names": [], "mappings": "AAiCA,sEAAA;AAEA,sBAAA;ACjCA,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;AD1DA;EACA,kBAAA;EACA,oBAAA;EACA,YAAA;EACA,kBAAA;EACA,gBAAA;EACA,mBAAA;EACA,mDAAA;EACA,+CAAA;EACA,8BAAA;AC6DA;AD3DA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,UAAA;EACA,eAAA;EACA,UAAA;AC6DA;AD1DA;EACA,kBAAA;EACA,qBAAA;EACA,eAzBA;EA0BA,eA3BA;ACuFA;ADzDA;EACA,kBAAA;EACA,cAhCA;EAiCA,eAjCA;EAkCA,MAAA;EACA,OAAA;EACA,kBAAA;EACA,kDAAA;EACA,8BAAA;EACA,wBAAA;AC2DA;ADxDA;EACA,sDAAA;AC0DA;ADxDA;EACA,2BAAA;AC0DA;ADtDA;EACA,cAAA;EACA,oBAAA;ACwDA;ADrDA;EAEA,qDAAA;ACsDA;ADjDA;EACA,aAAA;ACoDA;;AAEA,2CAA2C", "file": "ToggleSwitch.vue", "sourcesContent": [`<template lang="pug">
.switch-toggle(:class='{ "is-disabled": disabled || loading, "is-on": value }')
  input.toggle-input(type='checkbox' :checked='value' @change='onChange')

  span.toggle-track
    span.toggle-thumb
</template>

<script>
export default {
  name: 'ToggleSwitch',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    disabled: Boolean,
    loading: Boolean
  },
  methods: {
    onChange () {
      this.$emit('input', !this.value)
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

$thumb-side: 1.25rem;
$track-width: $thumb-side * 2 + 0.125rem;

.switch-toggle {
  position: relative;
  display: inline-flex;
  height: auto;
  width: max-content;
  padding: 0.25rem;
  border-radius: 2rem;
  border: 1px solid var(--toggle-switch-border-color);
  background-color: var(--toggle-switch-bg-color);
  transition: all 120ms ease-out;

  input.toggle-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
  }

  .toggle-track {
    position: relative;
    display: inline-block;
    width: $track-width;
    height: $thumb-side;
  }

  .toggle-thumb {
    position: absolute;
    width: $thumb-side;
    height: $thumb-side;
    top: 0;
    left: 0;
    border-radius: 50%;
    background-color: var(--toggle-switch-thumb-color);
    transition: all 120ms ease-out;
    transform: translateX(0);
  }

  &.is-on {
    background-color: var(--toggle-switch-bg-color_active);

    .toggle-thumb {
      transform: translateX(100%);
    }
  }

  &.is-disabled {
    opacity: 0.425;
    pointer-events: none;
  }

  &:hover,
  &:focus {
    border-color: var(--toggle-switch-border-color_focus);
  }
}

:root[data-theme="dark"] {
  .switch-toggle.is-disabled {
    opacity: 0.57;
  }
}
</style>
`, "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.switch-toggle {\n  position: relative;\n  display: inline-flex;\n  height: auto;\n  width: max-content;\n  padding: 0.25rem;\n  border-radius: 2rem;\n  border: 1px solid var(--toggle-switch-border-color);\n  background-color: var(--toggle-switch-bg-color);\n  transition: all 120ms ease-out;\n}\n.switch-toggle input.toggle-input {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  cursor: pointer;\n  z-index: 1;\n}\n.switch-toggle .toggle-track {\n  position: relative;\n  display: inline-block;\n  width: 2.625rem;\n  height: 1.25rem;\n}\n.switch-toggle .toggle-thumb {\n  position: absolute;\n  width: 1.25rem;\n  height: 1.25rem;\n  top: 0;\n  left: 0;\n  border-radius: 50%;\n  background-color: var(--toggle-switch-thumb-color);\n  transition: all 120ms ease-out;\n  transform: translateX(0);\n}\n.switch-toggle.is-on {\n  background-color: var(--toggle-switch-bg-color_active);\n}\n.switch-toggle.is-on .toggle-thumb {\n  transform: translateX(100%);\n}\n.switch-toggle.is-disabled {\n  opacity: 0.425;\n  pointer-events: none;\n}\n.switch-toggle:hover, .switch-toggle:focus {\n  border-color: var(--toggle-switch-border-color_focus);\n}\n\n:root[data-theme=dark] .switch-toggle.is-disabled {\n  opacity: 0.57;\n}\n\n/*# sourceMappingURL=ToggleSwitch.vue.map */"] }, media: void 0 });
};
var __vue_scope_id__5 = "data-v-2fb560dc";
var __vue_module_identifier__5 = void 0;
var __vue_is_functional_template__5 = false;
function __vue_normalize__5(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang="pug">
.switch-toggle(:class='{ "is-disabled": disabled || loading, "is-on": value }')
  input.toggle-input(type='checkbox' :checked='value' @change='onChange')

  span.toggle-track
    span.toggle-thumb
</template>

<script>
export default {
  name: 'ToggleSwitch',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    disabled: Boolean,
    loading: Boolean
  },
  methods: {
    onChange () {
      this.$emit('input', !this.value)
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

$thumb-side: 1.25rem;
$track-width: $thumb-side * 2 + 0.125rem;

.switch-toggle {
  position: relative;
  display: inline-flex;
  height: auto;
  width: max-content;
  padding: 0.25rem;
  border-radius: 2rem;
  border: 1px solid var(--toggle-switch-border-color);
  background-color: var(--toggle-switch-bg-color);
  transition: all 120ms ease-out;

  input.toggle-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
  }

  .toggle-track {
    position: relative;
    display: inline-block;
    width: $track-width;
    height: $thumb-side;
  }

  .toggle-thumb {
    position: absolute;
    width: $thumb-side;
    height: $thumb-side;
    top: 0;
    left: 0;
    border-radius: 50%;
    background-color: var(--toggle-switch-thumb-color);
    transition: all 120ms ease-out;
    transform: translateX(0);
  }

  &.is-on {
    background-color: var(--toggle-switch-bg-color_active);

    .toggle-thumb {
      transform: translateX(100%);
    }
  }

  &.is-disabled {
    opacity: 0.425;
    pointer-events: none;
  }

  &:hover,
  &:focus {
    border-color: var(--toggle-switch-border-color_focus);
  }
}

:root[data-theme="dark"] {
  .switch-toggle.is-disabled {
    opacity: 0.57;
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
function __vue_create_injector__5() {
  const styles = __vue_create_injector__5.styles || (__vue_create_injector__5.styles = {});
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
var __vue_component__5 = /* @__PURE__ */ __vue_normalize__5(
  { render: __vue_render__5, staticRenderFns: __vue_staticRenderFns__5 },
  __vue_inject_styles__5,
  __vue_script__5,
  __vue_scope_id__5,
  __vue_is_functional_template__5,
  __vue_module_identifier__5,
  false,
  __vue_create_injector__5,
  void 0,
  void 0
);
var ToggleSwitch_default = __vue_component__5;

// src/serve/dashboard/views/pages/design-system/design-system-content/ChelForms.vue
var __vue_script__6 = {
  name: "ChelForms",
  components: {
    ContentOutlet: ContentOutlet_default,
    TableTemplate: TableTemplate_default,
    TableRow: TableRow_default,
    ToggleSwitch: ToggleSwitch_default,
    StyledInput: StyledInput_default,
    Tooltip: Tooltip_default
  },
  data() {
    return {
      forms: {
        switchToggle: false,
        switchToggle2: false,
        styledInput1: "John Doe",
        styledInput2: "Disabled style",
        styledInput3: "Error style"
      },
      dummyContractItem: contractDummyData[0]
    };
  },
  methods: {
    onModalBtnClick() {
      esm_default(
        "okTurtles.events/emit",
        OPEN_MODAL,
        "ViewContractManifestModal",
        { contract: this.dummyContractItem }
      );
    },
    onPromptBtnClick() {
      esm_default(
        "okTurtles.events/emit",
        OPEN_PROMPT,
        {
          title: "Prompt title",
          content: 'Use <strong>sbp("okTurtles.events/emit", OPEN_PROMPT, params)</strong> to display a prompt.',
          primaryButton: "OK",
          secondaryButton: "Close"
        }
      );
    }
  }
};
var __vue_render__6 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("content-outlet", { attrs: { title: "Forms" } }, [
    _c(
      "div",
      { staticClass: "content-unit" },
      [
        _c("h4", { staticClass: "unit-name" }, [_vm._v("Styled Input")]),
        _c("div", { staticClass: "unit-description" }, [
          _vm._v("Use"),
          _c("span", { staticClass: "pill is-purple-1" }, [
            _vm._v("ToggleSwitch.vue")
          ]),
          _vm._v(
            "component. It has 'max' prop that allows to limit the number of characters, which is indiated via"
          ),
          _c("span", { staticClass: "pill is-purple-1" }, [
            _vm._v("CharLimitIndicator.vue")
          ]),
          _vm._v("component.")
        ]),
        _c(
          "table-template",
          [
            _c(
              "table-row",
              { attrs: { code: '<styled-input v-model="..." />' } },
              [
                _c("styled-input", {
                  attrs: {
                    label: "Username",
                    placeholder: "Enter user name",
                    max: 100
                  },
                  model: {
                    value: _vm.forms.styledInput1,
                    callback: function($$v) {
                      _vm.$set(_vm.forms, "styledInput1", $$v);
                    },
                    expression: "forms.styledInput1"
                  }
                })
              ],
              1
            ),
            _c(
              "table-row",
              { attrs: { code: '<styled-input :disabled="true" />' } },
              [
                _c("styled-input", {
                  attrs: {
                    label: "Username",
                    placeholder: "Enter user name",
                    max: 100,
                    disabled: true
                  },
                  model: {
                    value: _vm.forms.styledInput2,
                    callback: function($$v) {
                      _vm.$set(_vm.forms, "styledInput2", $$v);
                    },
                    expression: "forms.styledInput2"
                  }
                })
              ],
              1
            ),
            _c(
              "table-row",
              { attrs: { code: '<styled-input class="is-error" />' } },
              [
                _c("styled-input", {
                  staticClass: "is-error",
                  attrs: {
                    label: "Username",
                    placeholder: "Enter user name",
                    max: 100
                  },
                  model: {
                    value: _vm.forms.styledInput3,
                    callback: function($$v) {
                      _vm.$set(_vm.forms, "styledInput3", $$v);
                    },
                    expression: "forms.styledInput3"
                  }
                })
              ],
              1
            )
          ],
          1
        )
      ],
      1
    ),
    _c(
      "div",
      { staticClass: "content-unit" },
      [
        _c("h4", { staticClass: "unit-name" }, [_vm._v("Toggle Switch")]),
        _c("div", { staticClass: "unit-description" }, [
          _vm._v("Use"),
          _c("span", { staticClass: "pill is-purple-1" }, [
            _vm._v("ToggleSwitch.vue")
          ]),
          _vm._v("component")
        ]),
        _c(
          "table-template",
          [
            _c(
              "table-row",
              { attrs: { code: "<toggle-switch />" } },
              [
                _c("toggle-switch", {
                  model: {
                    value: _vm.forms.switchToggle,
                    callback: function($$v) {
                      _vm.$set(_vm.forms, "switchToggle", $$v);
                    },
                    expression: "forms.switchToggle"
                  }
                })
              ],
              1
            ),
            _c(
              "table-row",
              { attrs: { code: '<toggle-switch :disabled="true" />' } },
              [
                _c("toggle-switch", {
                  attrs: { disabled: true },
                  model: {
                    value: _vm.forms.switchToggle2,
                    callback: function($$v) {
                      _vm.$set(_vm.forms, "switchToggle2", $$v);
                    },
                    expression: "forms.switchToggle2"
                  }
                })
              ],
              1
            )
          ],
          1
        )
      ],
      1
    ),
    _c(
      "div",
      { staticClass: "content-unit" },
      [
        _c("h4", { staticClass: "unit-name" }, [_vm._v("Tooltip")]),
        _c("div", { staticClass: "unit-description" }, [
          _vm._v("Use"),
          _c("span", { staticClass: "pill is-purple-1" }, [
            _vm._v("Tooltip.vue")
          ]),
          _vm._v("component. Specify"),
          _c("strong", [_vm._v("'content'")]),
          _vm._v("prop for the tooltip content and use"),
          _c("strong", [_vm._v("'position'")]),
          _vm._v("prop to set the direction of the tooltip.")
        ]),
        _c(
          "table-template",
          [
            _c(
              "table-row",
              { attrs: { code: 'tooltip(content="..." direction="...")' } },
              [
                _c("tooltip", {
                  attrs: {
                    content: "If you don't want to moderate public data you should disable unencrypted contract data."
                  }
                })
              ],
              1
            )
          ],
          1
        )
      ],
      1
    ),
    _c(
      "div",
      { staticClass: "content-unit" },
      [
        _c("h4", { staticClass: "unit-name" }, [_vm._v("Modal & prompt")]),
        _c("div", { staticClass: "unit-description" }, [
          _vm._v(
            "Spawning a modal or a prompt can be done via calling corresponding sbp selectors.\n Use"
          ),
          _c("strong", [
            _vm._v(
              "'sbp('okTurtles.events/emit', OPEN_MODAL, 'modalName', ...)'"
            )
          ]),
          _vm._v("to use a modal.\nUse"),
          _c("strong", [
            _vm._v("'sbp('okTurtles.events/emit', OPEN_PROMPT, params)'")
          ]),
          _vm._v(
            "to display a prompt. Note that these two can be displayed at the same time too, and\n in this case the prompt is placed on top of the modal."
          )
        ]),
        _c(
          "table-template",
          [
            _c(
              "table-row",
              { attrs: { code: 'sbp("okTurtles.events/emit", OPEN_MODAL)' } },
              [
                _c(
                  "button",
                  {
                    staticClass: "is-small",
                    attrs: { type: "button" },
                    on: { click: _vm.onModalBtnClick }
                  },
                  [_vm._v("Open example modal")]
                )
              ]
            ),
            _c(
              "table-row",
              { attrs: { code: 'sbp("okTurtles.events/emit", OPEN_MODAL)' } },
              [
                _c(
                  "button",
                  {
                    staticClass: "is-small is-outlined",
                    attrs: { type: "button" },
                    on: { click: _vm.onPromptBtnClick }
                  },
                  [_vm._v("Open example prompt")]
                )
              ]
            )
          ],
          1
        )
      ],
      1
    ),
    _c("div", { staticClass: "content-unit" }, [
      _c("h4", { staticClass: "unit-name" }, [_vm._v("TBD...")]),
      _c("div", { staticClass: "unit-description" }, [_vm._v("TBD...")])
    ])
  ]);
};
var __vue_staticRenderFns__6 = [];
__vue_render__6._withStripped = true;
var __vue_inject_styles__6 = function(inject) {
  if (!inject) return;
  inject("data-v-3b32820c_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-3b32820c]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-3b32820c] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n/*# sourceMappingURL=ChelForms.vue.map */", map: { "version": 3, "sources": ["ChelForms.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AACtB,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;;AAEA,wCAAwC", "file": "ChelForms.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n/*# sourceMappingURL=ChelForms.vue.map */"] }, media: void 0 });
};
var __vue_scope_id__6 = "data-v-3b32820c";
var __vue_module_identifier__6 = void 0;
var __vue_is_functional_template__6 = false;
function __vue_normalize__6(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang="pug">
content-outlet(title='Forms')
  .content-unit
    h4.unit-name Styled Input

    .unit-description
      | Use
      span.pill.is-purple-1 ToggleSwitch.vue
      | component. It has 'max' prop that allows to limit the number of characters, which is indiated via
      span.pill.is-purple-1 CharLimitIndicator.vue
      | component.

    table-template
      table-row(code='<styled-input v-model="..." />')
        styled-input(
          label='Username'
          placeholder='Enter user name'
          :max='100'
          v-model='forms.styledInput1'
        )

      table-row(code='<styled-input :disabled="true" />')
        styled-input(
          label='Username'
          placeholder='Enter user name'
          :max='100'
          :disabled='true'
          v-model='forms.styledInput2'
        )

      table-row(code='<styled-input class="is-error" />')
        styled-input(
          class='is-error'
          label='Username'
          placeholder='Enter user name'
          :max='100'
          v-model='forms.styledInput3'
        )

  .content-unit
    h4.unit-name Toggle Switch

    .unit-description
      | Use
      span.pill.is-purple-1 ToggleSwitch.vue
      | component

    table-template
      table-row(code='<toggle-switch />')
        toggle-switch(v-model='forms.switchToggle')
      table-row(code='<toggle-switch :disabled="true" />')
        toggle-switch(v-model='forms.switchToggle2' :disabled='true')

  .content-unit
    h4.unit-name Tooltip

    .unit-description
      | Use
      span.pill.is-purple-1 Tooltip.vue
      | component. Specify
      strong 'content'
      | prop for the tooltip content and use
      strong 'position'
      | prop to set the direction of the tooltip.

    table-template
      table-row(code='tooltip(content="..." direction="...")')
        tooltip(content='If you don\\'t want to moderate public data you should disable unencrypted contract data.')

  .content-unit
    h4.unit-name Modal & prompt

    .unit-description
      | Spawning a modal or a prompt can be done via calling corresponding sbp selectors.
      |  Use
      strong 'sbp('okTurtles.events/emit', OPEN_MODAL, 'modalName', ...)'
      | to use a modal.
      | Use
      strong 'sbp('okTurtles.events/emit', OPEN_PROMPT, params)'
      | to display a prompt. Note that these two can be displayed at the same time too, and
      |  in this case the prompt is placed on top of the modal.

    table-template
      table-row(code='sbp("okTurtles.events/emit", OPEN_MODAL)')
        button.is-small(type='button' @click='onModalBtnClick') Open example modal
      table-row(code='sbp("okTurtles.events/emit", OPEN_MODAL)')
        button.is-small.is-outlined(type='button' @click='onPromptBtnClick') Open example prompt

  .content-unit
    h4.unit-name TBD...

    .unit-description TBD...
</template>

<script>
import sbp from '@sbp/sbp'
import ContentOutlet from './ContentOutlet.vue'
import TableTemplate from './TableTemplate.vue'
import TableRow from './TableRow.vue'
import ToggleSwitch from '../../../../../../../src/serve/dashboard/views/components/forms/ToggleSwitch.vue'
import StyledInput from '../../../../../../../src/serve/dashboard/views/components/forms/StyledInput.vue'
import Tooltip from '../../../../../../../src/serve/dashboard/views/components/Tooltip.vue'
import { contractDummyData } from '../../../../../../../src/serve/dashboard/views/utils/dummy-data.js'
import { OPEN_MODAL, OPEN_PROMPT } from '../../../../../../../src/serve/dashboard/views/utils/events.js'

export default {
  name: 'ChelForms',
  components: {
    ContentOutlet,
    TableTemplate,
    TableRow,
    ToggleSwitch,
    StyledInput,
    Tooltip
  },
  data () {
    return {
      forms: {
        switchToggle: false,
        switchToggle2: false,
        styledInput1: 'John Doe',
        styledInput2: 'Disabled style',
        styledInput3: 'Error style'
      },
      dummyContractItem: contractDummyData[0]
    }
  },
  methods: {
    onModalBtnClick () {
      sbp(
        'okTurtles.events/emit',
        OPEN_MODAL,
        'ViewContractManifestModal',
        { contract: this.dummyContractItem }
      )
    },
    onPromptBtnClick () {
      sbp(
        'okTurtles.events/emit',
        OPEN_PROMPT,
        {
          title: 'Prompt title',
          content: 'Use <strong>sbp("okTurtles.events/emit", OPEN_PROMPT, params)</strong> to display a prompt.',
          primaryButton: 'OK',
          secondaryButton: 'Close'
        }
      )
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;
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
function __vue_create_injector__6() {
  const styles = __vue_create_injector__6.styles || (__vue_create_injector__6.styles = {});
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
var __vue_component__6 = /* @__PURE__ */ __vue_normalize__6(
  { render: __vue_render__6, staticRenderFns: __vue_staticRenderFns__6 },
  __vue_inject_styles__6,
  __vue_script__6,
  __vue_scope_id__6,
  __vue_is_functional_template__6,
  __vue_module_identifier__6,
  false,
  __vue_create_injector__6,
  void 0,
  void 0
);
var ChelForms_default = __vue_component__6;

// src/serve/dashboard/views/pages/design-system/design-system-content/ChelButtons.vue
var __vue_script__7 = {
  name: "ChelButtons",
  components: {
    ContentOutlet: ContentOutlet_default,
    TableTemplate: TableTemplate_default,
    TableRow: TableRow_default
  }
};
var __vue_render__7 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("content-outlet", { attrs: { title: "Buttons" } }, [
    _c(
      "div",
      { staticClass: "content-unit" },
      [
        _c("h4", { staticClass: "unit-name" }, [
          _vm._v("Various button classes")
        ]),
        _c("div", { staticClass: "unit-description" }, [
          _vm._v(
            "There are two types of buttons that are primarily used across the app."
          ),
          _c("span", { staticClass: "pill is-purple-1" }, [_vm._v("primary")]),
          _vm._v("style and"),
          _c("span", { staticClass: "pill is-purple-1" }, [_vm._v("outlined")]),
          _vm._v(
            "style. Primary style does not require any css class. To use outlined style, use"
          ),
          _c("strong", [_vm._v(".is-outlined")]),
          _vm._v(
            "css class. Check out other useful button-related css classes below, and feel free to extend"
          ),
          _c("span", { staticClass: "pill is-purple-1" }, [
            _vm._v("_buttons.scss")
          ]),
          _vm._v("file for more styles.")
        ]),
        _c(
          "table-template",
          [
            _c("table-row", { attrs: { code: 'button(type="button")' } }, [
              _c("button", { attrs: { type: "button" } }, [_vm._v("Primary")])
            ]),
            _c("table-row", { attrs: { code: "button.is-outlined" } }, [
              _c(
                "button",
                { staticClass: "is-outlined", attrs: { type: "button" } },
                [_vm._v("Outlined")]
              )
            ]),
            _c("table-row", { attrs: { code: "button.has-blue-background" } }, [
              _c(
                "button",
                {
                  staticClass: "has-blue-background",
                  attrs: { type: "button" }
                },
                [_vm._v("Blue Background")]
              )
            ]),
            _c("table-row", { attrs: { code: 'button(:disabled="true")' } }, [
              _c("button", { attrs: { type: "button", disabled: true } }, [
                _vm._v("Disabled")
              ])
            ]),
            _c(
              "table-row",
              { attrs: { code: 'button.is-outlined(:disabled="true")' } },
              [
                _c(
                  "button",
                  {
                    staticClass: "is-outlined",
                    attrs: { type: "button", disabled: true }
                  },
                  [_vm._v("Disabled")]
                )
              ]
            ),
            _c("table-row", { attrs: { code: "button.is-small" } }, [
              _c(
                "button",
                { staticClass: "is-small", attrs: { type: "button" } },
                [_vm._v("Small button")]
              )
            ]),
            _c(
              "table-row",
              { attrs: { code: "button.is-small.is-outlined" } },
              [
                _c(
                  "button",
                  {
                    staticClass: "is-small is-outlined",
                    attrs: { type: "button" }
                  },
                  [_vm._v("Small button")]
                )
              ]
            ),
            _c(
              "table-row",
              { attrs: { code: "button.is-small.has-blue-background" } },
              [
                _c(
                  "button",
                  {
                    staticClass: "is-small has-blue-background",
                    attrs: { type: "button" }
                  },
                  [_vm._v("Small button")]
                )
              ]
            ),
            _c("table-row", { attrs: { code: "button.is-extra-small" } }, [
              _c(
                "button",
                { staticClass: "is-extra-small", attrs: { type: "button" } },
                [_vm._v("Extra small")]
              )
            ]),
            _c(
              "table-row",
              { attrs: { code: "button.is-outlined.is-extra-small" } },
              [
                _c(
                  "button",
                  {
                    staticClass: "is-outlined is-extra-small",
                    attrs: { type: "button" }
                  },
                  [_vm._v("Extra small")]
                )
              ]
            ),
            _c(
              "table-row",
              { attrs: { code: "button.is-outlined.has-blue-background" } },
              [
                _c(
                  "button",
                  {
                    staticClass: "has-blue-background is-extra-small",
                    attrs: { type: "button" }
                  },
                  [_vm._v("Extra small")]
                )
              ]
            )
          ],
          1
        )
      ],
      1
    ),
    _c(
      "div",
      { staticClass: "content-unit" },
      [
        _c("h4", { staticClass: "unit-name" }, [_vm._v("Icon buttons")]),
        _c("div", { staticClass: "unit-description" }, [
          _vm._v("Styles for icons as buttons.")
        ]),
        _c(
          "table-template",
          [
            _c("table-row", { attrs: { code: "button.is-icon" } }, [
              _c(
                "button",
                { staticClass: "is-icon", attrs: { type: "button" } },
                [_c("i", { staticClass: "icon-gear" })]
              )
            ]),
            _c("table-row", { attrs: { code: "button.is-icon-small" } }, [
              _c(
                "button",
                { staticClass: "is-icon-small", attrs: { type: "button" } },
                [_c("i", { staticClass: "icon-menu" })]
              )
            ])
          ],
          1
        )
      ],
      1
    )
  ]);
};
var __vue_staticRenderFns__7 = [];
__vue_render__7._withStripped = true;
var __vue_inject_styles__7 = function(inject) {
  if (!inject) return;
  inject("data-v-2110256e_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-2110256e]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-2110256e] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n/*# sourceMappingURL=ChelButtons.vue.map */", map: { "version": 3, "sources": ["ChelButtons.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AACtB,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;;AAEA,0CAA0C", "file": "ChelButtons.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n/*# sourceMappingURL=ChelButtons.vue.map */"] }, media: void 0 });
};
var __vue_scope_id__7 = "data-v-2110256e";
var __vue_module_identifier__7 = void 0;
var __vue_is_functional_template__7 = false;
function __vue_normalize__7(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang="pug">
content-outlet(title='Buttons')
  .content-unit
    h4.unit-name Various button classes

    .unit-description
      | There are two types of buttons that are primarily used across the app.
      span.pill.is-purple-1 primary
      | style and
      span.pill.is-purple-1 outlined
      | style. Primary style does not require any css class. To use outlined style, use
      strong .is-outlined
      | css class. Check out other useful button-related css classes below, and feel free to extend
      span.pill.is-purple-1 _buttons.scss
      | file for more styles.

    table-template
      table-row(code='button(type="button")')
        button(type='button') Primary
      table-row(code='button.is-outlined')
        button.is-outlined(type='button') Outlined
      table-row(code='button.has-blue-background')
        button.has-blue-background(type='button') Blue Background
      table-row(code='button(:disabled="true")')
        button(type='button' :disabled='true') Disabled
      table-row(code='button.is-outlined(:disabled="true")')
        button.is-outlined(type='button' :disabled='true') Disabled
      table-row(code='button.is-small')
        button.is-small(type='button') Small button
      table-row(code='button.is-small.is-outlined')
        button.is-small.is-outlined(type='button') Small button
      table-row(code='button.is-small.has-blue-background')
        button.is-small.has-blue-background(type='button') Small button
      table-row(code='button.is-extra-small')
        button.is-extra-small(type='button') Extra small
      table-row(code='button.is-outlined.is-extra-small')
        button.is-outlined.is-extra-small(type='button') Extra small
      table-row(code='button.is-outlined.has-blue-background')
        button.has-blue-background.is-extra-small(type='button') Extra small

  .content-unit
    h4.unit-name Icon buttons

    .unit-description Styles for icons as buttons.

    table-template
      table-row(code='button.is-icon')
        button.is-icon(type='button')
          i.icon-gear
      table-row(code='button.is-icon-small')
        button.is-icon-small(type='button')
          i.icon-menu
</template>

<script>
import ContentOutlet from './ContentOutlet.vue'
import TableTemplate from './TableTemplate.vue'
import TableRow from './TableRow.vue'

export default {
  name: 'ChelButtons',
  components: {
    ContentOutlet,
    TableTemplate,
    TableRow
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;
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
function __vue_create_injector__7() {
  const styles = __vue_create_injector__7.styles || (__vue_create_injector__7.styles = {});
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
var __vue_component__7 = /* @__PURE__ */ __vue_normalize__7(
  { render: __vue_render__7, staticRenderFns: __vue_staticRenderFns__7 },
  __vue_inject_styles__7,
  __vue_script__7,
  __vue_scope_id__7,
  __vue_is_functional_template__7,
  __vue_module_identifier__7,
  false,
  __vue_create_injector__7,
  void 0,
  void 0
);
var ChelButtons_default = __vue_component__7;

// src/serve/dashboard/views/pages/design-system/design-system-content/ChelIcons.vue
var __vue_script__8 = {
  name: "ChelIcons",
  components: {
    ContentOutlet: ContentOutlet_default,
    TableTemplate: TableTemplate_default,
    TableRow: TableRow_default
  },
  data() {
    return {
      iconNames: [
        "chalkboard",
        "address-book",
        "user",
        "user-circle",
        "user-rectangle",
        "users",
        "suitcase",
        "list-bullets",
        "list-checks",
        "menu",
        "gear",
        "gear-six",
        "plus",
        "plus-circle",
        "minus",
        "minus-circle",
        "cross",
        "cross-circle",
        "trend-up",
        "trend-down",
        "chart-up",
        "chart-bar",
        "battery-full",
        "battery-charging",
        "bell",
        "check",
        "checks",
        "check-circle",
        "check-square",
        "sun",
        "moon",
        "moonstar",
        "currency-circle",
        "network",
        "three-circle-plus",
        "caret-up",
        "caret-down",
        "caret-circle-up",
        "caret-circle-down",
        "info",
        "close",
        "close-circle",
        "copy"
      ]
    };
  }
};
var __vue_render__8 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("content-outlet", { attrs: { title: "Icons" } }, [
    _c(
      "div",
      { staticClass: "content-unit" },
      [
        _c("h4", { staticClass: "unit-name" }, [_vm._v("Icon classes")]),
        _c("div", { staticClass: "unit-description" }, [
          _vm._v("Use"),
          _c("strong", [_vm._v(".icon-[name]")]),
          _vm._v("css class to use icons. Check out"),
          _c("span", { staticClass: "pill is-purple-1" }, [
            _vm._v("_icons.scss")
          ]),
          _vm._v("file to see all available icon names.")
        ]),
        _c(
          "table-template",
          _vm._l(_vm.iconNames, function(iconname) {
            return _c(
              "table-row",
              {
                key: iconname,
                staticClass: "c-row",
                attrs: { code: ".icon-" + iconname }
              },
              [_c("i", { class: "icon-" + iconname })]
            );
          }),
          1
        )
      ],
      1
    )
  ]);
};
var __vue_staticRenderFns__8 = [];
__vue_render__8._withStripped = true;
var __vue_inject_styles__8 = function(inject) {
  if (!inject) return;
  inject("data-v-af60418a_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-af60418a]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-af60418a] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-row[data-v-af60418a]  i {\n  font-size: 1.5em;\n  font-weight: bold;\n}\n\n/*# sourceMappingURL=ChelIcons.vue.map */", map: { "version": 3, "sources": ["ChelIcons.vue", "src/serve/dashboard/views/pages/design-system/design-system-content/ChelIcons.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AACtB,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;ACrCA;EACA,gBAAA;EACA,iBAAA;ADwCA;;AAEA,wCAAwC", "file": "ChelIcons.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-row ::v-deep i {\n  font-size: 1.5em;\n  font-weight: bold;\n}\n\n/*# sourceMappingURL=ChelIcons.vue.map */", `<template lang="pug">
content-outlet(title='Icons')
  .content-unit
    h4.unit-name Icon classes

    .unit-description
      | Use
      strong .icon-[name]
      | css class to use icons. Check out
      span.pill.is-purple-1 _icons.scss
      | file to see all available icon names.

    table-template
      table-row.c-row(
        v-for='iconname in iconNames'
        :key='iconname'
        :code='".icon-" + iconname'
      )
        i(:class='"icon-" + iconname')
</template>

<script>
import ContentOutlet from './ContentOutlet.vue'
import TableTemplate from './TableTemplate.vue'
import TableRow from './TableRow.vue'

export default {
  name: 'ChelIcons',
  components: {
    ContentOutlet,
    TableTemplate,
    TableRow
  },
  data () {
    return {
      iconNames: [
        'chalkboard', 'address-book', 'user', 'user-circle', 'user-rectangle',
        'users', 'suitcase', 'list-bullets', 'list-checks', 'menu', 'gear',
        'gear-six', 'plus', 'plus-circle', 'minus', 'minus-circle', 'cross',
        'cross-circle', 'trend-up', 'trend-down', 'chart-up', 'chart-bar',
        'battery-full', 'battery-charging', 'bell', 'check', 'checks',
        'check-circle', 'check-square', 'sun', 'moon', 'moonstar', 'currency-circle',
        'network', 'three-circle-plus', 'caret-up', 'caret-down', 'caret-circle-up',
        'caret-circle-down', 'info', 'close', 'close-circle', 'copy'
      ]
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-row ::v-deep {
  i {
    font-size: 1.5em;
    font-weight: bold;
  }
}
</style>
`] }, media: void 0 });
};
var __vue_scope_id__8 = "data-v-af60418a";
var __vue_module_identifier__8 = void 0;
var __vue_is_functional_template__8 = false;
function __vue_normalize__8(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang="pug">
content-outlet(title='Icons')
  .content-unit
    h4.unit-name Icon classes

    .unit-description
      | Use
      strong .icon-[name]
      | css class to use icons. Check out
      span.pill.is-purple-1 _icons.scss
      | file to see all available icon names.

    table-template
      table-row.c-row(
        v-for='iconname in iconNames'
        :key='iconname'
        :code='".icon-" + iconname'
      )
        i(:class='"icon-" + iconname')
</template>

<script>
import ContentOutlet from './ContentOutlet.vue'
import TableTemplate from './TableTemplate.vue'
import TableRow from './TableRow.vue'

export default {
  name: 'ChelIcons',
  components: {
    ContentOutlet,
    TableTemplate,
    TableRow
  },
  data () {
    return {
      iconNames: [
        'chalkboard', 'address-book', 'user', 'user-circle', 'user-rectangle',
        'users', 'suitcase', 'list-bullets', 'list-checks', 'menu', 'gear',
        'gear-six', 'plus', 'plus-circle', 'minus', 'minus-circle', 'cross',
        'cross-circle', 'trend-up', 'trend-down', 'chart-up', 'chart-bar',
        'battery-full', 'battery-charging', 'bell', 'check', 'checks',
        'check-circle', 'check-square', 'sun', 'moon', 'moonstar', 'currency-circle',
        'network', 'three-circle-plus', 'caret-up', 'caret-down', 'caret-circle-up',
        'caret-circle-down', 'info', 'close', 'close-circle', 'copy'
      ]
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-row ::v-deep {
  i {
    font-size: 1.5em;
    font-weight: bold;
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
function __vue_create_injector__8() {
  const styles = __vue_create_injector__8.styles || (__vue_create_injector__8.styles = {});
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
var __vue_component__8 = /* @__PURE__ */ __vue_normalize__8(
  { render: __vue_render__8, staticRenderFns: __vue_staticRenderFns__8 },
  __vue_inject_styles__8,
  __vue_script__8,
  __vue_scope_id__8,
  __vue_is_functional_template__8,
  __vue_module_identifier__8,
  false,
  __vue_create_injector__8,
  void 0,
  void 0
);
var ChelIcons_default = __vue_component__8;

// src/serve/dashboard/views/pages/design-system/design-system-content/ChelListsTables.vue
var __vue_script__9 = {
  name: "ChelListsTables",
  components: {
    ContentOutlet: ContentOutlet_default
  }
};
var __vue_render__9 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("content-outlet", { attrs: { title: "Lists & Tables" } }, [
    _c("div", { staticClass: "content-unit" }, [
      _c("h4", { staticClass: "unit-name" }, [_vm._v("TBD...")]),
      _c("div", { staticClass: "unit-description" }, [_vm._v("TBD...")])
    ])
  ]);
};
var __vue_staticRenderFns__9 = [];
__vue_render__9._withStripped = true;
var __vue_inject_styles__9 = function(inject) {
  if (!inject) return;
  inject("data-v-f4183ef0_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-f4183ef0]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-f4183ef0] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n/*# sourceMappingURL=ChelListsTables.vue.map */", map: { "version": 3, "sources": ["ChelListsTables.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AACtB,qBAAqB;AACrB;EACE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AAEA;EACE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;;AAEA,8CAA8C", "file": "ChelListsTables.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n/*# sourceMappingURL=ChelListsTables.vue.map */"] }, media: void 0 });
};
var __vue_scope_id__9 = "data-v-f4183ef0";
var __vue_module_identifier__9 = void 0;
var __vue_is_functional_template__9 = false;
function __vue_normalize__9(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang="pug">
content-outlet(title='Lists & Tables')
  .content-unit
    h4.unit-name TBD...

    .unit-description TBD...
</template>

<script>
import ContentOutlet from './ContentOutlet.vue'

export default {
  name: 'ChelListsTables',
  components: {
    ContentOutlet
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;
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
function __vue_create_injector__9() {
  const styles = __vue_create_injector__9.styles || (__vue_create_injector__9.styles = {});
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
var __vue_component__9 = /* @__PURE__ */ __vue_normalize__9(
  { render: __vue_render__9, staticRenderFns: __vue_staticRenderFns__9 },
  __vue_inject_styles__9,
  __vue_script__9,
  __vue_scope_id__9,
  __vue_is_functional_template__9,
  __vue_module_identifier__9,
  false,
  __vue_create_injector__9,
  void 0,
  void 0
);
var ChelListsTables_default = __vue_component__9;

// src/serve/dashboard/views/pages/design-system/CheloniaDesignSystem.vue
var menuList = [
  { id: "typography", name: "Typography", component: ChelTypography_default },
  { id: "forms", name: "Forms", component: ChelForms_default },
  { id: "buttons", name: "Buttons", component: ChelButtons_default },
  { id: "icons", name: "Icons", component: ChelIcons_default },
  { id: "lists-and-tables", name: "Lists & Tables", component: ChelListsTables_default }
];
var __vue_script__10 = {
  name: "CheloniaDesignSystem",
  data() {
    return {
      currentContent: menuList[0],
      menuList
    };
  },
  methods: {
    onMenuClick(menu) {
      this.currentContent = menu;
      this.$router.push({ query: { tab: menu.id } }).catch(() => {
      });
    }
  },
  created() {
    const tabId = this.$route.query?.tab;
    if (tabId) {
      const found = menuList.find((entry) => entry.id === tabId);
      this.currentContent = found;
    }
  },
  watch: {
    $route(to) {
      const tabId = to.query?.tab;
      const menuIdList = menuList.map((m) => m.id);
      if (tabId && menuIdList.includes(tabId) && this.currentContent.id !== tabId) {
        const found = menuList.find((entry) => entry.id === tabId);
        this.currentContent = found;
      }
    }
  }
};
var __vue_render__10 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "c-page-design-system" }, [
    _c("div", { staticClass: "c-page-wrapper" }, [
      _c("header", { staticClass: "c-page-header" }, [
        _vm._m(0),
        _c("div", { staticClass: "c-menu" }, [
          _c("div", { staticClass: "section-title" }, [_vm._v("Topics:")]),
          _c(
            "div",
            { staticClass: "c-menu-btns" },
            _vm._l(_vm.menuList, function(menu) {
              return _c(
                "button",
                {
                  key: menu.id,
                  staticClass: "c-menu-btn",
                  class: { "is-active": _vm.currentContent.id === menu.id },
                  on: {
                    click: function($event) {
                      return _vm.onMenuClick(menu);
                    }
                  }
                },
                [_vm._v(_vm._s(menu.name))]
              );
            }),
            0
          )
        ])
      ]),
      _c(
        "main",
        { staticClass: "c-main" },
        [_c(_vm.currentContent.component, { tag: "component" })],
        1
      )
    ])
  ]);
};
var __vue_staticRenderFns__10 = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "c-page-title" }, [
      _c("i", { staticClass: "icon-three-circle-plus c-header-icon" }),
      _c("h2", { staticClass: "is-title-2" }, [_vm._v("Design system")])
    ]);
  }
];
__vue_render__10._withStripped = true;
var __vue_inject_styles__10 = function(inject) {
  if (!inject) return;
  inject("data-v-745eaa1c_0", { source: '/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-745eaa1c]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-745eaa1c] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-page-wrapper[data-v-745eaa1c] {\n  position: relative;\n  display: block;\n  margin: 0 auto;\n  border-left: 1px solid var(--border);\n  border-right: 1px solid var(--border);\n  width: 100%;\n  max-width: 72rem;\n  min-height: 100%;\n}\n.c-page-header[data-v-745eaa1c] {\n  padding-top: 1.75rem;\n  padding-bottom: 1.75rem;\n  margin-bottom: 2rem;\n  border-bottom: 1px solid var(--border);\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n@media screen and (min-width: 769px), print {\n.c-page-header[data-v-745eaa1c] {\n    padding-left: 2rem;\n    padding-right: 2rem;\n}\n}\n.c-page-header .c-page-title[data-v-745eaa1c] {\n  display: flex;\n  align-items: center;\n}\n.c-page-header .c-page-title .c-header-icon[data-v-745eaa1c] {\n  display: inline-block;\n  font-size: 2.25rem;\n  line-height: 1;\n  margin-right: 0.5rem;\n}\n.c-page-header .c-menu[data-v-745eaa1c] {\n  margin-top: 1.75rem;\n}\n.c-page-header .c-menu .section-title[data-v-745eaa1c] {\n  font-size: 0.875rem;\n  color: var(--text_0);\n}\n.c-page-header .c-menu-btns[data-v-745eaa1c] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.785rem;\n}\nbutton.c-menu-btn[data-v-745eaa1c] {\n  display: inline-block;\n  border: 1px solid var(--ds-menu-border-color);\n  color: var(--text_0);\n  background-color: rgba(0, 0, 0, 0);\n  min-height: unset;\n  font-size: 0.75rem;\n  padding: 0.375rem 0.75rem;\n  border-radius: 3px;\n}\nbutton.c-menu-btn[data-v-745eaa1c]:hover, button.c-menu-btn[data-v-745eaa1c]:focus {\n  background-color: var(--ds-menu-border-color);\n}\nbutton.c-menu-btn[data-v-745eaa1c]:active, button.c-menu-btn.is-active[data-v-745eaa1c] {\n  background-color: var(--ds-menu-border-color);\n  font-weight: 600;\n}\nbutton.c-menu-btn.is-active[data-v-745eaa1c]::before {\n  content: "";\n  display: inline-block;\n  position: relative;\n  width: 4px;\n  height: 4px;\n  border-radius: 50%;\n  background-color: currentColor;\n  margin-right: 0.25rem;\n  transform: translateY(-1px);\n}\n.c-main[data-v-745eaa1c] {\n  width: 100%;\n  overflow-x: hidden;\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n@media screen and (min-width: 769px), print {\n.c-main[data-v-745eaa1c] {\n    padding-left: 2rem;\n    padding-right: 2rem;\n}\n}\n\n/*# sourceMappingURL=CheloniaDesignSystem.vue.map */', map: { "version": 3, "sources": ["CheloniaDesignSystem.vue", "src/serve/dashboard/views/pages/design-system/CheloniaDesignSystem.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AC6GtB,qBAAA;AAGA;ED7GE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AC4EA;EAIA,kCAAA;EAAA,oCAAA;EAAA,2CAAA;EAAA,8CAAA;EAAA,iCAAA;EAAA,uDAAA;EAAA,4CAAA;EAAA,kDAAA;EAAA,wCAAA;EAAA,iDAAA;EAAA,4DAAA;EAAA,mCAAA;EAAA,sDAAA;EAAA,0CAAA;EAAA,+BAAA;EAAA,6CAAA;EAAA,mDAAA;EAAA,iCAAA;EAAA,wCAAA;EAAA,iCAAA;EAAA,4BAAA;EAAA,mCAAA;EAAA,+CAAA;EAAA,gCAAA;EAAA,8BAAA;EAAA,gCAAA;EAAA,0CAAA;EAAA,yBAAA;EAAA,yCAAA;EAAA,+CAAA;EAAA,kCAAA;EAAA,+BAAA;EAAA,mCAAA;EAAA,qCAAA;EAAA,uCAAA;EAAA,mDAAA;EAAA,8CAAA;EAAA,6BAAA;EAAA,sIAAA;EAAA,0BAAA;EAAA,iBAAA;EAAA,uCAAA;ADnCA;ACHA;EACA,kBAAA;EACA,cAAA;EACA,cAAA;EACA,oCAAA;EACA,qCAAA;EACA,WAAA;EACA,gBAAA;EACA,gBAAA;ADMA;ACHA;EACA,oBAAA;EACA,uBAAA;EACA,mBAAA;EACA,sCAAA;EAxBA,kBAAA;EACA,mBAAA;AD+BA;AACA;ACbA;IAhBA,kBAAA;IACA,mBAAA;ADgCE;AACF;ACXA;EACA,aAAA;EACA,mBAAA;ADaA;ACXA;EACA,qBAAA;EACA,kBAAA;EACA,cAAA;EACA,oBAAA;ADaA;ACTA;EACA,mBAAA;ADWA;ACTA;EACA,mBAAA;EACA,oBAAA;ADWA;ACRA;EACA,aAAA;EACA,eAAA;EACA,mBAAA;EACA,aAAA;ADUA;ACLA;EACA,qBAAA;EACA,6CAAA;EACA,oBAAA;EACA,kCAAA;EACA,iBAAA;EACA,kBAAA;EACA,yBAAA;EACA,kBAAA;ADQA;ACNA;EAEA,6CAAA;ADOA;ACJA;EAEA,6CAAA;EACA,gBAAA;ADKA;ACFA;EACA,WAAA;EACA,qBAAA;EACA,kBAAA;EACA,UAAA;EACA,WAAA;EACA,kBAAA;EACA,8BAAA;EACA,qBAAA;EACA,2BAAA;ADIA;ACAA;EACA,WAAA;EACA,kBAAA;EA5FA,kBAAA;EACA,mBAAA;ADgGA;AACA;ACRA;IAtFA,kBAAA;IACA,mBAAA;ADiGE;AACF;;AAEA,mDAAmD", "file": "CheloniaDesignSystem.vue", "sourcesContent": ['/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-page-wrapper {\n  position: relative;\n  display: block;\n  margin: 0 auto;\n  border-left: 1px solid var(--border);\n  border-right: 1px solid var(--border);\n  width: 100%;\n  max-width: 72rem;\n  min-height: 100%;\n}\n\n.c-page-header {\n  padding-top: 1.75rem;\n  padding-bottom: 1.75rem;\n  margin-bottom: 2rem;\n  border-bottom: 1px solid var(--border);\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n@media screen and (min-width: 769px), print {\n  .c-page-header {\n    padding-left: 2rem;\n    padding-right: 2rem;\n  }\n}\n.c-page-header .c-page-title {\n  display: flex;\n  align-items: center;\n}\n.c-page-header .c-page-title .c-header-icon {\n  display: inline-block;\n  font-size: 2.25rem;\n  line-height: 1;\n  margin-right: 0.5rem;\n}\n.c-page-header .c-menu {\n  margin-top: 1.75rem;\n}\n.c-page-header .c-menu .section-title {\n  font-size: 0.875rem;\n  color: var(--text_0);\n}\n.c-page-header .c-menu-btns {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.785rem;\n}\n\nbutton.c-menu-btn {\n  display: inline-block;\n  border: 1px solid var(--ds-menu-border-color);\n  color: var(--text_0);\n  background-color: rgba(0, 0, 0, 0);\n  min-height: unset;\n  font-size: 0.75rem;\n  padding: 0.375rem 0.75rem;\n  border-radius: 3px;\n}\nbutton.c-menu-btn:hover, button.c-menu-btn:focus {\n  background-color: var(--ds-menu-border-color);\n}\nbutton.c-menu-btn:active, button.c-menu-btn.is-active {\n  background-color: var(--ds-menu-border-color);\n  font-weight: 600;\n}\nbutton.c-menu-btn.is-active::before {\n  content: "";\n  display: inline-block;\n  position: relative;\n  width: 4px;\n  height: 4px;\n  border-radius: 50%;\n  background-color: currentColor;\n  margin-right: 0.25rem;\n  transform: translateY(-1px);\n}\n\n.c-main {\n  width: 100%;\n  overflow-x: hidden;\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n@media screen and (min-width: 769px), print {\n  .c-main {\n    padding-left: 2rem;\n    padding-right: 2rem;\n  }\n}\n\n/*# sourceMappingURL=CheloniaDesignSystem.vue.map */', `<template lang="pug">
.c-page-design-system
  .c-page-wrapper
    header.c-page-header
      .c-page-title
        i.icon-three-circle-plus.c-header-icon
        h2.is-title-2 Design system

      .c-menu
        .section-title Topics:

        .c-menu-btns
          button.c-menu-btn(
            v-for='menu in menuList'
            :key='menu.id'
            :class='{ "is-active": currentContent.id === menu.id }'
            @click='onMenuClick(menu)'
          ) {{ menu.name }}

    main.c-main
      component(:is='currentContent.component')
</template>

<script>
import Typography from './design-system-content/ChelTypography.vue'
import Forms from './design-system-content/ChelForms.vue'
import Buttons from './design-system-content/ChelButtons.vue'
import Icons from './design-system-content/ChelIcons.vue'
import ListsTables from './design-system-content/ChelListsTables.vue'

const menuList = [
  { id: 'typography', name: 'Typography', component: Typography },
  { id: 'forms', name: 'Forms', component: Forms },
  { id: 'buttons', name: 'Buttons', component: Buttons },
  { id: 'icons', name: 'Icons', component: Icons },
  { id: 'lists-and-tables', name: 'Lists & Tables', component: ListsTables }
]

export default {
  name: 'CheloniaDesignSystem',
  data () {
    return {
      currentContent: menuList[0],
      menuList
    }
  },
  methods: {
    onMenuClick (menu) {
      this.currentContent = menu

      this.$router.push({ query: { tab: menu.id } }).catch(() => {})
    }
  },
  created () {
    const tabId = this.$route.query?.tab

    if (tabId) {
      const found = menuList.find(entry => entry.id === tabId)
      this.currentContent = found
    }
  },
  watch: {
    $route (to) {
      const tabId = to.query?.tab
      const menuIdList = menuList.map(m => m.id)

      if (tabId && menuIdList.includes(tabId) && this.currentContent.id !== tabId) {
        const found = menuList.find(entry => entry.id === tabId)
        this.currentContent = found
      }
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

@mixin sidePadding {
  padding-left: 1rem;
  padding-right: 1rem;

  @include tablet {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.c-page-wrapper {
  position: relative;
  display: block;
  margin: 0 auto;
  border-left: 1px solid $border;
  border-right: 1px solid $border;
  width: 100%;
  max-width: 72rem;
  min-height: 100%;
}

.c-page-header {
  padding-top: 1.75rem;
  padding-bottom: 1.75rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid $border;
  @include sidePadding;

  .c-page-title {
    display: flex;
    align-items: center;

    .c-header-icon {
      display: inline-block;
      font-size: 2.25rem;
      line-height: 1;
      margin-right: 0.5rem;
    }
  }

  .c-menu {
    margin-top: 1.75rem;

    .section-title {
      font-size: $size_5;
      color: $text_0;
    }

    &-btns {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.785rem;
    }
  }
}

button.c-menu-btn {
  display: inline-block;
  border: 1px solid var(--ds-menu-border-color);
  color: $text_0;
  background-color: rgba(0, 0, 0, 0);
  min-height: unset;
  font-size: $size_6;
  padding: 0.375rem 0.75rem;
  border-radius: $radius;

  &:hover,
  &:focus {
    background-color: var(--ds-menu-border-color);
  }

  &:active,
  &.is-active {
    background-color: var(--ds-menu-border-color);
    font-weight: 600;
  }

  &.is-active::before {
    content: "";
    display: inline-block;
    position: relative;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: currentColor;
    margin-right: 0.25rem;
    transform: translateY(-1px);
  }
}

.c-main {
  width: 100%;
  overflow-x: hidden;
  @include sidePadding;
}
</style>
`] }, media: void 0 });
};
var __vue_scope_id__10 = "data-v-745eaa1c";
var __vue_module_identifier__10 = void 0;
var __vue_is_functional_template__10 = false;
function __vue_normalize__10(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang="pug">
.c-page-design-system
  .c-page-wrapper
    header.c-page-header
      .c-page-title
        i.icon-three-circle-plus.c-header-icon
        h2.is-title-2 Design system

      .c-menu
        .section-title Topics:

        .c-menu-btns
          button.c-menu-btn(
            v-for='menu in menuList'
            :key='menu.id'
            :class='{ "is-active": currentContent.id === menu.id }'
            @click='onMenuClick(menu)'
          ) {{ menu.name }}

    main.c-main
      component(:is='currentContent.component')
</template>

<script>
import Typography from './design-system-content/ChelTypography.vue'
import Forms from './design-system-content/ChelForms.vue'
import Buttons from './design-system-content/ChelButtons.vue'
import Icons from './design-system-content/ChelIcons.vue'
import ListsTables from './design-system-content/ChelListsTables.vue'

const menuList = [
  { id: 'typography', name: 'Typography', component: Typography },
  { id: 'forms', name: 'Forms', component: Forms },
  { id: 'buttons', name: 'Buttons', component: Buttons },
  { id: 'icons', name: 'Icons', component: Icons },
  { id: 'lists-and-tables', name: 'Lists & Tables', component: ListsTables }
]

export default {
  name: 'CheloniaDesignSystem',
  data () {
    return {
      currentContent: menuList[0],
      menuList
    }
  },
  methods: {
    onMenuClick (menu) {
      this.currentContent = menu

      this.$router.push({ query: { tab: menu.id } }).catch(() => {})
    }
  },
  created () {
    const tabId = this.$route.query?.tab

    if (tabId) {
      const found = menuList.find(entry => entry.id === tabId)
      this.currentContent = found
    }
  },
  watch: {
    $route (to) {
      const tabId = to.query?.tab
      const menuIdList = menuList.map(m => m.id)

      if (tabId && menuIdList.includes(tabId) && this.currentContent.id !== tabId) {
        const found = menuList.find(entry => entry.id === tabId)
        this.currentContent = found
      }
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

@mixin sidePadding {
  padding-left: 1rem;
  padding-right: 1rem;

  @include tablet {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.c-page-wrapper {
  position: relative;
  display: block;
  margin: 0 auto;
  border-left: 1px solid $border;
  border-right: 1px solid $border;
  width: 100%;
  max-width: 72rem;
  min-height: 100%;
}

.c-page-header {
  padding-top: 1.75rem;
  padding-bottom: 1.75rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid $border;
  @include sidePadding;

  .c-page-title {
    display: flex;
    align-items: center;

    .c-header-icon {
      display: inline-block;
      font-size: 2.25rem;
      line-height: 1;
      margin-right: 0.5rem;
    }
  }

  .c-menu {
    margin-top: 1.75rem;

    .section-title {
      font-size: $size_5;
      color: $text_0;
    }

    &-btns {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.785rem;
    }
  }
}

button.c-menu-btn {
  display: inline-block;
  border: 1px solid var(--ds-menu-border-color);
  color: $text_0;
  background-color: rgba(0, 0, 0, 0);
  min-height: unset;
  font-size: $size_6;
  padding: 0.375rem 0.75rem;
  border-radius: $radius;

  &:hover,
  &:focus {
    background-color: var(--ds-menu-border-color);
  }

  &:active,
  &.is-active {
    background-color: var(--ds-menu-border-color);
    font-weight: 600;
  }

  &.is-active::before {
    content: "";
    display: inline-block;
    position: relative;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: currentColor;
    margin-right: 0.25rem;
    transform: translateY(-1px);
  }
}

.c-main {
  width: 100%;
  overflow-x: hidden;
  @include sidePadding;
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
function __vue_create_injector__10() {
  const styles = __vue_create_injector__10.styles || (__vue_create_injector__10.styles = {});
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
var __vue_component__10 = /* @__PURE__ */ __vue_normalize__10(
  { render: __vue_render__10, staticRenderFns: __vue_staticRenderFns__10 },
  __vue_inject_styles__10,
  __vue_script__10,
  __vue_scope_id__10,
  __vue_is_functional_template__10,
  __vue_module_identifier__10,
  false,
  __vue_create_injector__10,
  void 0,
  void 0
);
var CheloniaDesignSystem_default = __vue_component__10;
export {
  CheloniaDesignSystem_default as default
};
