import {
  StatCard_default
} from "./chunk-5TQ54KRC.js";
import {
  MONTHS_MILLIS,
  addTimeToDate,
  humanDate
} from "./chunk-OID3DFNC.js";
import {
  PageTemplate_default
} from "./chunk-3KF7JRLD.js";
import {
  L
} from "./chunk-ZI2WDK4P.js";
import "./chunk-UHFMZPCY.js";

// src/serve/dashboard/views/pages/Dashboard.vue
var PAST_THREE_MONTHS = -3 * MONTHS_MILLIS;
var randomPastDate = () => addTimeToDate(/* @__PURE__ */ new Date(), Math.floor(Math.random() * PAST_THREE_MONTHS));
var __vue_script__ = {
  name: "Dashboard",
  components: {
    PageTemplate: PageTemplate_default,
    StatCard: StatCard_default
  },
  data() {
    return {
      ephemeral: {
        // ------ temporary dummy placeholder data ------ //
        stats: [
          { id: "users", name: L("Total users"), value: 2150, icon: "trend-up" },
          { id: "groups", name: L("Total groups"), value: 23, icon: "chart-bar" },
          { id: "storage", name: L("Total storage"), value: "2GB", icon: "battery-charging" }
        ],
        recentUsers: [
          { name: "TaoEffect", joined: randomPastDate() },
          { name: "Leilha P", joined: randomPastDate() },
          { name: "Alex Jin", joined: randomPastDate() },
          { name: "Sebin Song", joined: randomPastDate() },
          { name: "Pierre", joined: randomPastDate() }
        ].sort((a, b) => b.joined.getTime() - a.joined.getTime()),
        spaceUsage: {
          database: { name: L("Database"), value: 1.8, unit: "Gb" },
          media: { name: L("Media/Images"), value: 500, unit: "Mb" }
        }
      }
    };
  },
  methods: {
    humanDate
  }
};
var __vue_render__ = function() {
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
            return [_vm._v(_vm._s(_vm.L("Dashboard")))];
          },
          proxy: true
        }
      ])
    },
    [
      _c("div", { staticClass: "is-centered-on-mobile" }, [
        _c(
          "section",
          { staticClass: "c-stats-section" },
          [
            _c("i18n", { staticClass: "section-title" }, [_vm._v("Stats")]),
            _c(
              "div",
              { staticClass: "c-stat-cards" },
              _vm._l(_vm.ephemeral.stats, function(item, index) {
                return _c("StatCard", {
                  key: item.id,
                  staticClass: "c-stat-card",
                  attrs: {
                    description: item.name,
                    stat: item.value,
                    icon: item.icon,
                    color: index % 2 === 0 ? "blue" : "purple"
                  }
                });
              }),
              1
            )
          ],
          1
        ),
        _c(
          "section",
          { staticClass: "c-recent-and-summary" },
          [
            _c("i18n", { staticClass: "section-title" }, [
              _vm._v("Users / Space")
            ]),
            _c("div", { staticClass: "c-flex-container" }, [
              _c(
                "div",
                { staticClass: "summary-list c-summary-list" },
                [
                  _c("i18n", { staticClass: "summary-list-label" }, [
                    _vm._v("Recent users")
                  ]),
                  _c(
                    "ul",
                    [
                      _c(
                        "li",
                        { staticClass: "summary-list-item c-user-list-ths" },
                        [
                          _c("i18n", { attrs: { tag: "label" } }, [
                            _vm._v("Name")
                          ]),
                          _c("i18n", { attrs: { tag: "label" } }, [
                            _vm._v("Joined on")
                          ])
                        ],
                        1
                      ),
                      _vm._l(_vm.ephemeral.recentUsers, function(user) {
                        return _c(
                          "li",
                          { key: user.name, staticClass: "summary-list-item" },
                          [
                            _c("span", [_vm._v(_vm._s(user.name))]),
                            _c("span", [
                              _vm._v(_vm._s(_vm.humanDate(user.joined)))
                            ])
                          ]
                        );
                      })
                    ],
                    2
                  )
                ],
                1
              ),
              _c(
                "div",
                { staticClass: "summary-list is-outlined c-summary-list" },
                [
                  _c("i18n", { staticClass: "summary-list-label" }, [
                    _vm._v("Space usage")
                  ]),
                  _c(
                    "ul",
                    _vm._l(_vm.ephemeral.spaceUsage, function(item, key) {
                      return _c(
                        "li",
                        { key, staticClass: "summary-list-item" },
                        [
                          _c("label", [_vm._v(_vm._s(item.name))]),
                          _c("span", { staticClass: "c-usage-value" }, [
                            _vm._v(
                              _vm._s(item.value) + " " + _vm._s(item.unit)
                            )
                          ])
                        ]
                      );
                    }),
                    0
                  )
                ],
                1
              )
            ])
          ],
          1
        )
      ])
    ]
  );
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
var __vue_inject_styles__ = function(inject) {
  if (!inject) return;
  inject("data-v-26ae62e5_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-26ae62e5]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-26ae62e5] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n@media screen and (max-width: 768px) {\n.c-sections-container[data-v-26ae62e5] {\n    max-width: 36.5rem;\n    margin-left: auto;\n    margin-right: auto;\n}\n}\n.c-stats-section[data-v-26ae62e5] {\n  margin-bottom: 3.2rem;\n}\n.c-stat-cards[data-v-26ae62e5] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1.25rem;\n}\n.c-flex-container[data-v-26ae62e5] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: flex-start;\n  justify-content: flex-start;\n  gap: 1.75rem;\n}\n.c-user-list-ths[data-v-26ae62e5] {\n  font-weight: 600;\n  font-size: 0.875rem;\n  margin-bottom: 0.25rem;\n}\n.c-usage-value[data-v-26ae62e5] {\n  font-weight: 600;\n  font-size: 1.25em;\n}\n@media screen and (max-width: 768px) {\n.c-summary-list[data-v-26ae62e5] {\n    max-width: unset;\n}\n}\n\n/*# sourceMappingURL=Dashboard.vue.map */", map: { "version": 3, "sources": ["Dashboard.vue", "src/serve/dashboard/views/pages/Dashboard.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AC6GtB,qBAAA;AAGA;EAIA,kCAAA;EAAA,iCAAA;EAAA,2CAAA;EAAA,iDAAA;EAAA,oCAAA;EAAA,sDAAA;EAAA,+CAAA;EAAA,qDAAA;EAAA,qCAAA;EAAA,4DAAA;EAAA,sDAAA;EAAA,mCAAA;EAAA,8CAAA;EAAA,0CAAA;EAAA,+BAAA;EAAA,gDAAA;EAAA,sDAAA;EAAA,4CAAA;EAAA,wCAAA;EAAA,iCAAA;EAAA,4BAAA;EAAA,mCAAA;EAAA,wDAAA;EAAA,6BAAA;EAAA,8BAAA;EAAA,gCAAA;EAAA,6CAAA;EAAA,sBAAA;EAAA,qCAAA;EAAA,0BAAA;EAAA,kCAAA;EAAA,6CAAA;EAAA,mCAAA;EAAA,qCAAA;EAAA,uCAAA;EAAA,+DAAA;EAAA,2CAAA;EAAA,0BAAA;EAAA,2HAAA;EAAA,qCAAA;EAAA,iBAAA;EAAA,+BAAA;ADvEA;AC4EA;EDzEE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;AAEA;ACLA;IAEA,kBAAA;IACA,iBAAA;IACA,kBAAA;ADME;AACF;ACHA;EACA,qBAAA;ADMA;ACHA;EACA,kBAAA;EACA,aAAA;EACA,mBAAA;EACA,eAAA;EACA,YAAA;ADMA;ACHA;EACA,aAAA;EACA,eAAA;EACA,uBAAA;EACA,2BAAA;EACA,YAAA;ADMA;ACHA;EACA,gBAAA;EACA,mBAAA;EACA,sBAAA;ADMA;ACHA;EACA,gBAAA;EACA,iBAAA;ADMA;AAEA;ACLA;IAEA,gBAAA;ADME;AACF;;AAEA,wCAAwC", "file": "Dashboard.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n@media screen and (max-width: 768px) {\n  .c-sections-container {\n    max-width: 36.5rem;\n    margin-left: auto;\n    margin-right: auto;\n  }\n}\n\n.c-stats-section {\n  margin-bottom: 3.2rem;\n}\n\n.c-stat-cards {\n  position: relative;\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1.25rem;\n}\n\n.c-flex-container {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: flex-start;\n  justify-content: flex-start;\n  gap: 1.75rem;\n}\n\n.c-user-list-ths {\n  font-weight: 600;\n  font-size: 0.875rem;\n  margin-bottom: 0.25rem;\n}\n\n.c-usage-value {\n  font-weight: 600;\n  font-size: 1.25em;\n}\n\n@media screen and (max-width: 768px) {\n  .c-summary-list {\n    max-width: unset;\n  }\n}\n\n/*# sourceMappingURL=Dashboard.vue.map */", `<template lang='pug'>
PageTemplate
  template(#title='') {{ L('Dashboard') }}

  .is-centered-on-mobile
    section.c-stats-section
      i18n.section-title Stats

      .c-stat-cards
        StatCard.c-stat-card(v-for='(item, index) in ephemeral.stats'
          :key='item.id'
          :description='item.name'
          :stat='item.value'
          :icon='item.icon'
          :color='index % 2 === 0 ? "blue" : "purple"'
        )

    section.c-recent-and-summary
      i18n.section-title Users / Space

      .c-flex-container
        .summary-list.c-summary-list
          i18n.summary-list-label Recent users

          ul
            li.summary-list-item.c-user-list-ths
              i18n(tag='label') Name
              i18n(tag='label') Joined on
            li.summary-list-item(v-for='user in ephemeral.recentUsers' :key='user.name')
              span {{ user.name }}
              span {{ humanDate(user.joined) }}

        .summary-list.is-outlined.c-summary-list
          i18n.summary-list-label Space usage

          ul
            li.summary-list-item(v-for='(item, key) in ephemeral.spaceUsage' :key='key')
              label {{ item.name }}
              span.c-usage-value {{ item.value }} {{ item.unit }}
</template>

<script>
import PageTemplate from './PageTemplate.vue'
import StatCard from '../../../../../src/serve/dashboard/views/components/StatCard.vue'
import L from '../../../../../src/serve/dashboard/common/translations.js'
import { addTimeToDate, MONTHS_MILLIS, humanDate } from '../../../../../src/serve/dashboard/common/cdTimeUtils.js'

const PAST_THREE_MONTHS = -3 * MONTHS_MILLIS
const randomPastDate = () => addTimeToDate(new Date(), Math.floor(Math.random() * PAST_THREE_MONTHS))

export default {
  name: 'Dashboard',
  components: {
    PageTemplate,
    StatCard
  },
  data () {
    return {
      ephemeral: {
        // ------ temporary dummy placeholder data ------ //
        stats: [
          { id: 'users', name: L('Total users'), value: 2150, icon: 'trend-up' },
          { id: 'groups', name: L('Total groups'), value: 23, icon: 'chart-bar' },
          { id: 'storage', name: L('Total storage'), value: '2GB', icon: 'battery-charging' }
        ],
        recentUsers: [
          { name: 'TaoEffect', joined: randomPastDate() },
          { name: 'Leilha P', joined: randomPastDate() },
          { name: 'Alex Jin', joined: randomPastDate() },
          { name: 'Sebin Song', joined: randomPastDate() },
          { name: 'Pierre', joined: randomPastDate() }
        ].sort((a, b) => b.joined.getTime() - a.joined.getTime()),
        spaceUsage: {
          database: { name: L('Database'), value: 1.8, unit: 'Gb' },
          media: { name: L('Media/Images'), value: 500, unit: 'Mb' }
        }
      }
    }
  },
  methods: {
    humanDate
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-sections-container {
  @include phone {
    max-width: $formWidthConstraint;
    margin-left: auto;
    margin-right: auto;
  }
}

.c-stats-section {
  margin-bottom: 3.2rem;
}

.c-stat-cards {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.c-flex-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1.75rem;
}

.c-user-list-ths {
  font-weight: 600;
  font-size: $size_5;
  margin-bottom: 0.25rem;
}

.c-usage-value {
  font-weight: 600;
  font-size: 1.25em;
}

.c-summary-list {
  @include phone {
    max-width: unset;
  }
}
</style>
`] }, media: void 0 });
};
var __vue_scope_id__ = "data-v-26ae62e5";
var __vue_module_identifier__ = void 0;
var __vue_is_functional_template__ = false;
function __vue_normalize__(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang='pug'>
PageTemplate
  template(#title='') {{ L('Dashboard') }}

  .is-centered-on-mobile
    section.c-stats-section
      i18n.section-title Stats

      .c-stat-cards
        StatCard.c-stat-card(v-for='(item, index) in ephemeral.stats'
          :key='item.id'
          :description='item.name'
          :stat='item.value'
          :icon='item.icon'
          :color='index % 2 === 0 ? "blue" : "purple"'
        )

    section.c-recent-and-summary
      i18n.section-title Users / Space

      .c-flex-container
        .summary-list.c-summary-list
          i18n.summary-list-label Recent users

          ul
            li.summary-list-item.c-user-list-ths
              i18n(tag='label') Name
              i18n(tag='label') Joined on
            li.summary-list-item(v-for='user in ephemeral.recentUsers' :key='user.name')
              span {{ user.name }}
              span {{ humanDate(user.joined) }}

        .summary-list.is-outlined.c-summary-list
          i18n.summary-list-label Space usage

          ul
            li.summary-list-item(v-for='(item, key) in ephemeral.spaceUsage' :key='key')
              label {{ item.name }}
              span.c-usage-value {{ item.value }} {{ item.unit }}
</template>

<script>
import PageTemplate from './PageTemplate.vue'
import StatCard from '../../../../../src/serve/dashboard/views/components/StatCard.vue'
import L from '../../../../../src/serve/dashboard/common/translations.js'
import { addTimeToDate, MONTHS_MILLIS, humanDate } from '../../../../../src/serve/dashboard/common/cdTimeUtils.js'

const PAST_THREE_MONTHS = -3 * MONTHS_MILLIS
const randomPastDate = () => addTimeToDate(new Date(), Math.floor(Math.random() * PAST_THREE_MONTHS))

export default {
  name: 'Dashboard',
  components: {
    PageTemplate,
    StatCard
  },
  data () {
    return {
      ephemeral: {
        // ------ temporary dummy placeholder data ------ //
        stats: [
          { id: 'users', name: L('Total users'), value: 2150, icon: 'trend-up' },
          { id: 'groups', name: L('Total groups'), value: 23, icon: 'chart-bar' },
          { id: 'storage', name: L('Total storage'), value: '2GB', icon: 'battery-charging' }
        ],
        recentUsers: [
          { name: 'TaoEffect', joined: randomPastDate() },
          { name: 'Leilha P', joined: randomPastDate() },
          { name: 'Alex Jin', joined: randomPastDate() },
          { name: 'Sebin Song', joined: randomPastDate() },
          { name: 'Pierre', joined: randomPastDate() }
        ].sort((a, b) => b.joined.getTime() - a.joined.getTime()),
        spaceUsage: {
          database: { name: L('Database'), value: 1.8, unit: 'Gb' },
          media: { name: L('Media/Images'), value: 500, unit: 'Mb' }
        }
      }
    }
  },
  methods: {
    humanDate
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-sections-container {
  @include phone {
    max-width: $formWidthConstraint;
    margin-left: auto;
    margin-right: auto;
  }
}

.c-stats-section {
  margin-bottom: 3.2rem;
}

.c-stat-cards {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.c-flex-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1.75rem;
}

.c-user-list-ths {
  font-weight: 600;
  font-size: $size_5;
  margin-bottom: 0.25rem;
}

.c-usage-value {
  font-weight: 600;
  font-size: 1.25em;
}

.c-summary-list {
  @include phone {
    max-width: unset;
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
var Dashboard_default = __vue_component__;
export {
  Dashboard_default as default
};
