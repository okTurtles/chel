import {
  StatCard_default
} from "./chunk-5TQ54KRC.js";
import {
  credits,
  humanBytes,
  liveData_default
} from "./chunk-34AVBA6C.js";
import "./chunk-LFSZ3O36.js";
import {
  InfoCard_default
} from "./chunk-QZCHUD6N.js";
import {
  PageTemplate_default
} from "./chunk-3KF7JRLD.js";
import {
  L
} from "./chunk-ZI2WDK4P.js";
import "./chunk-UHFMZPCY.js";

// src/serve/dashboard/views/pages/Users.vue
var __vue_script__ = {
  name: "Users",
  mixins: [liveData_default("users")],
  components: {
    PageTemplate: PageTemplate_default,
    StatCard: StatCard_default,
    InfoCard: InfoCard_default
  },
  computed: {
    liveUsers() {
      return this.live.data.filter((user) => !user.deleted);
    },
    totalSize() {
      return this.liveUsers.reduce((sum, user) => sum + user.size, 0);
    },
    userStats() {
      return [
        { id: "users", name: L("Users"), value: this.liveUsers.length, icon: "users" },
        { id: "deleted", name: L("Deleted accounts"), value: this.live.data.length - this.liveUsers.length, icon: "trend-down" },
        { id: "storage", name: L("Storage used"), value: humanBytes(this.totalSize), icon: "battery-charging" }
      ];
    }
  },
  methods: {
    credits,
    humanBytes,
    shareOf(size) {
      return this.totalSize ? `${(100 * size / this.totalSize).toFixed(1)}%` : "0%";
    }
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
            return [_vm._v(_vm._s(_vm.L("Users")))];
          },
          proxy: true
        }
      ])
    },
    [
      _vm.live.error ? _c("InfoCard", { attrs: { heading: _vm.L("Note") } }, [
        _vm._v(_vm._s(_vm.live.error))
      ]) : _vm.live.data ? _c("div", { staticClass: "is-centered-on-mobile" }, [
        _c(
          "section",
          { staticClass: "c-user-stats-section" },
          [
            _c("i18n", { staticClass: "section-title" }, [_vm._v("Stats")]),
            _c(
              "div",
              { staticClass: "c-stat-cards" },
              _vm._l(_vm.userStats, function(item, index) {
                return _c("StatCard", {
                  key: item.id,
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
          { staticClass: "c-user-table" },
          [
            _c("i18n", { staticClass: "section-title" }, [
              _vm._v("Usage by user")
            ]),
            _c("div", { staticClass: "summary-list c-user-usages" }, [
              _c("div", { staticClass: "c-table-wrapper" }, [
                _c("table", { staticClass: "table c-table" }, [
                  _c("thead", [
                    _c(
                      "tr",
                      [
                        _c(
                          "i18n",
                          {
                            staticClass: "c-th-user",
                            attrs: { tag: "th" }
                          },
                          [_vm._v("User")]
                        ),
                        _c(
                          "i18n",
                          {
                            staticClass: "c-th-owned-contracts",
                            attrs: { tag: "th" }
                          },
                          [_vm._v("Contracts owned")]
                        ),
                        _c(
                          "i18n",
                          {
                            staticClass: "c-th-owned-files",
                            attrs: { tag: "th" }
                          },
                          [_vm._v("Files owned")]
                        ),
                        _c(
                          "i18n",
                          {
                            staticClass: "c-th-space-used",
                            attrs: { tag: "th" }
                          },
                          [_vm._v("Space used")]
                        ),
                        _c(
                          "i18n",
                          {
                            staticClass: "c-th-space-share",
                            attrs: { tag: "th" }
                          },
                          [_vm._v("Share of storage")]
                        ),
                        _c(
                          "i18n",
                          {
                            staticClass: "c-th-credits",
                            attrs: { tag: "th" }
                          },
                          [_vm._v("Credits")]
                        )
                      ],
                      1
                    )
                  ]),
                  _c(
                    "tbody",
                    _vm._l(_vm.live.data, function(item) {
                      return _c(
                        "tr",
                        { key: item.username },
                        [
                          _c(
                            "td",
                            { staticClass: "c-cell-name has-text-bold" },
                            [_vm._v(_vm._s(item.username))]
                          ),
                          item.deleted ? _c(
                            "td",
                            {
                              staticClass: "c-cell-deleted",
                              attrs: { colspan: "5" }
                            },
                            [
                              _c(
                                "i18n",
                                {
                                  staticClass: "pill is-danger",
                                  attrs: { tag: "span" }
                                },
                                [_vm._v("Account deleted")]
                              )
                            ],
                            1
                          ) : [
                            _c(
                              "td",
                              { staticClass: "c-cell-contracts-owned" },
                              [_vm._v(_vm._s(item.ownedContracts))]
                            ),
                            _c(
                              "td",
                              { staticClass: "c-cell-files-owned" },
                              [_vm._v(_vm._s(item.ownedFiles))]
                            ),
                            _c("td", { staticClass: "c-cell-space" }, [
                              _vm._v(_vm._s(_vm.humanBytes(item.size)))
                            ]),
                            _c(
                              "td",
                              { staticClass: "c-cell-space-share" },
                              [_vm._v(_vm._s(_vm.shareOf(item.size)))]
                            ),
                            _c(
                              "td",
                              {
                                staticClass: "c-cell-credits",
                                class: {
                                  "has-text-danger": item.picocredits.startsWith("-")
                                }
                              },
                              [
                                _vm._v(
                                  _vm._s(_vm.credits(item.picocredits))
                                )
                              ]
                            )
                          ]
                        ],
                        2
                      );
                    }),
                    0
                  )
                ])
              ])
            ])
          ],
          1
        )
      ]) : _vm._e()
    ],
    1
  );
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
var __vue_inject_styles__ = function(inject) {
  if (!inject) return;
  inject("data-v-1a0916c5_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-1a0916c5]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-1a0916c5] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-stat-cards[data-v-1a0916c5] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1.25rem;\n}\n.c-user-usages[data-v-1a0916c5] {\n  max-width: max-content;\n}\n.c-user-table[data-v-1a0916c5] {\n  margin-top: 3rem;\n}\n.c-table-wrapper[data-v-1a0916c5] {\n  position: relative;\n  overflow-x: auto;\n  max-width: 100%;\n}\n.c-table[data-v-1a0916c5] {\n  position: relative;\n  height: max-content;\n}\n.c-th-user[data-v-1a0916c5],\n.c-cell-name[data-v-1a0916c5] {\n  position: sticky;\n  left: 0;\n  padding: 0 0.8rem 0 0.2rem;\n  background-color: var(--summary-list-bg-color);\n  min-width: 8rem;\n}\n.c-cell-name[data-v-1a0916c5] {\n  line-height: 1.4;\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n.c-th-owned-files[data-v-1a0916c5],\n.c-cell-files-owned[data-v-1a0916c5],\n.c-th-credits[data-v-1a0916c5],\n.c-cell-credits[data-v-1a0916c5] {\n  min-width: 6.25rem;\n  text-align: center;\n}\n.c-th-owned-contracts[data-v-1a0916c5],\n.c-cell-contracts-owned[data-v-1a0916c5],\n.c-th-space-used[data-v-1a0916c5],\n.c-cell-space[data-v-1a0916c5] {\n  min-width: 8.75rem;\n  text-align: center;\n}\n.c-th-space-share[data-v-1a0916c5],\n.c-cell-space-share[data-v-1a0916c5] {\n  min-width: 9.25rem;\n  text-align: center;\n}\n.c-cell-deleted[data-v-1a0916c5] {\n  text-align: center;\n}\n\n/*# sourceMappingURL=Users.vue.map */", map: { "version": 3, "sources": ["Users.vue", "src/serve/dashboard/views/pages/Users.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AC6GtB,qBAAA;AAGA;ED7GE,kCAAkC;EAClC,iCAAiC;EACjC,2CAA2C;EAC3C,iDAAiD;EACjD,oCAAoC;EACpC,sDAAsD;EACtD,+CAA+C;EAC/C,qDAAqD;EACrD,qCAAqC;EACrC,4DAA4D;EAC5D,sDAAsD;EACtD,mCAAmC;EACnC,8CAA8C;EAC9C,0CAA0C;EAC1C,+BAA+B;EAC/B,gDAAgD;EAChD,sDAAsD;EACtD,4CAA4C;EAC5C,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,wDAAwD;EACxD,6BAA6B;EAC7B,8BAA8B;EAC9B,gCAAgC;EAChC,6CAA6C;EAC7C,sBAAsB;EACtB,qCAAqC;EACrC,0BAA0B;EAC1B,kCAAkC;EAClC,6CAA6C;EAC7C,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,+DAA+D;EAC/D,2CAA2C;EAC3C,0BAA0B;EAC1B,2HAA2H;EAC3H,qCAAqC;EACrC,iBAAiB;EACjB,+BAA+B;AACjC;AC4EA;EDzEE,kCAAkC;EAClC,oCAAoC;EACpC,2CAA2C;EAC3C,8CAA8C;EAC9C,iCAAiC;EACjC,uDAAuD;EACvD,4CAA4C;EAC5C,kDAAkD;EAClD,wCAAwC;EACxC,iDAAiD;EACjD,4DAA4D;EAC5D,mCAAmC;EACnC,sDAAsD;EACtD,0CAA0C;EAC1C,+BAA+B;EAC/B,6CAA6C;EAC7C,mDAAmD;EACnD,iCAAiC;EACjC,wCAAwC;EACxC,iCAAiC;EACjC,4BAA4B;EAC5B,mCAAmC;EACnC,+CAA+C;EAC/C,gCAAgC;EAChC,8BAA8B;EAC9B,gCAAgC;EAChC,0CAA0C;EAC1C,yBAAyB;EACzB,yCAAyC;EACzC,+CAA+C;EAC/C,kCAAkC;EAClC,+BAA+B;EAC/B,mCAAmC;EACnC,qCAAqC;EACrC,uCAAuC;EACvC,mDAAmD;EACnD,8CAA8C;EAC9C,6BAA6B;EAC7B,sIAAsI;EACtI,0BAA0B;EAC1B,iBAAiB;EACjB,uCAAuC;AACzC;ACAA;EACA,kBAAA;EACA,aAAA;EACA,mBAAA;EACA,eAAA;EACA,YAAA;ADGA;ACAA;EACA,sBAAA;ADGA;ACAA;EACA,gBAAA;ADGA;ACAA;EACA,kBAAA;EACA,gBAAA;EACA,eAAA;ADGA;ACAA;EACA,kBAAA;EACA,mBAAA;ADGA;ACAA;;EAEA,gBAAA;EACA,OAAA;EACA,0BAAA;EACA,8CAAA;EACA,eAAA;ADGA;ACAA;EACA,gBAAA;EACA,oBAAA;EACA,uBAAA;ADGA;ACAA;;;;EAIA,kBAAA;EACA,kBAAA;ADGA;ACAA;;;;EAIA,kBAAA;EACA,kBAAA;ADGA;ACAA;;EAEA,kBAAA;EACA,kBAAA;ADGA;ACAA;EACA,kBAAA;ADGA;;AAEA,oCAAoC", "file": "Users.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-stat-cards {\n  position: relative;\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 1.25rem;\n}\n\n.c-user-usages {\n  max-width: max-content;\n}\n\n.c-user-table {\n  margin-top: 3rem;\n}\n\n.c-table-wrapper {\n  position: relative;\n  overflow-x: auto;\n  max-width: 100%;\n}\n\n.c-table {\n  position: relative;\n  height: max-content;\n}\n\n.c-th-user,\n.c-cell-name {\n  position: sticky;\n  left: 0;\n  padding: 0 0.8rem 0 0.2rem;\n  background-color: var(--summary-list-bg-color);\n  min-width: 8rem;\n}\n\n.c-cell-name {\n  line-height: 1.4;\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n\n.c-th-owned-files,\n.c-cell-files-owned,\n.c-th-credits,\n.c-cell-credits {\n  min-width: 6.25rem;\n  text-align: center;\n}\n\n.c-th-owned-contracts,\n.c-cell-contracts-owned,\n.c-th-space-used,\n.c-cell-space {\n  min-width: 8.75rem;\n  text-align: center;\n}\n\n.c-th-space-share,\n.c-cell-space-share {\n  min-width: 9.25rem;\n  text-align: center;\n}\n\n.c-cell-deleted {\n  text-align: center;\n}\n\n/*# sourceMappingURL=Users.vue.map */", `<template lang='pug'>
PageTemplate
  template(#title='') {{ L('Users') }}

  InfoCard(v-if='live.error' :heading='L("Note")') {{ live.error }}

  .is-centered-on-mobile(v-else-if='live.data')
    section.c-user-stats-section
      i18n.section-title Stats

      .c-stat-cards
        StatCard(v-for='(item, index) in userStats'
          :key='item.id'
          :description='item.name'
          :stat='item.value'
          :icon='item.icon'
          :color='index % 2 === 0 ? "blue" : "purple"'
        )

    section.c-user-table
      i18n.section-title Usage by user

      .summary-list.c-user-usages
        .c-table-wrapper
          table.table.c-table
            thead
              tr
                i18n.c-th-user(tag='th') User
                i18n.c-th-owned-contracts(tag='th') Contracts owned
                i18n.c-th-owned-files(tag='th') Files owned
                i18n.c-th-space-used(tag='th') Space used
                i18n.c-th-space-share(tag='th') Share of storage
                i18n.c-th-credits(tag='th') Credits

            tbody
              tr(v-for='item in live.data' :key='item.username')
                td.c-cell-name.has-text-bold {{ item.username }}
                td.c-cell-deleted(v-if='item.deleted' colspan='5')
                  i18n.pill.is-danger(tag='span') Account deleted
                template(v-else)
                  td.c-cell-contracts-owned {{ item.ownedContracts }}
                  td.c-cell-files-owned {{ item.ownedFiles }}
                  td.c-cell-space {{ humanBytes(item.size) }}
                  td.c-cell-space-share {{ shareOf(item.size) }}
                  td.c-cell-credits(:class='{ "has-text-danger": item.picocredits.startsWith("-") }') {{ credits(item.picocredits) }}
</template>

<script>
import PageTemplate from './PageTemplate.vue'
import StatCard from '../../../../../src/serve/dashboard/views/components/StatCard.vue'
import InfoCard from '../../../../../src/serve/dashboard/views/components/InfoCard.vue'
import L from '../../../../../src/serve/dashboard/common/translations.js'
import liveData from '../../../../../src/serve/dashboard/views/utils/liveData.js'
import { credits, humanBytes } from '../../../../../src/serve/dashboard/views/utils/format.js'

export default {
  name: 'Users',
  mixins: [liveData('users')],
  components: {
    PageTemplate,
    StatCard,
    InfoCard
  },
  computed: {
    liveUsers () {
      return this.live.data.filter(user => !user.deleted)
    },
    totalSize () {
      return this.liveUsers.reduce((sum, user) => sum + user.size, 0)
    },
    userStats () {
      return [
        { id: 'users', name: L('Users'), value: this.liveUsers.length, icon: 'users' },
        { id: 'deleted', name: L('Deleted accounts'), value: this.live.data.length - this.liveUsers.length, icon: 'trend-down' },
        { id: 'storage', name: L('Storage used'), value: humanBytes(this.totalSize), icon: 'battery-charging' }
      ]
    }
  },
  methods: {
    credits,
    humanBytes,
    shareOf (size) {
      return this.totalSize ? \`\${(100 * size / this.totalSize).toFixed(1)}%\` : '0%'
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-stat-cards {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.c-user-usages {
  max-width: max-content;
}

.c-user-table {
  margin-top: 3rem;
}

.c-table-wrapper {
  position: relative;
  overflow-x: auto;
  max-width: 100%;
}

.c-table {
  position: relative;
  height: max-content;
}

.c-th-user,
.c-cell-name {
  position: sticky;
  left: 0;
  padding: 0 0.8rem 0 0.2rem;
  background-color: var(--summary-list-bg-color);
  min-width: 8rem;
}

.c-cell-name {
  line-height: 1.4;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.c-th-owned-files,
.c-cell-files-owned,
.c-th-credits,
.c-cell-credits {
  min-width: 6.25rem;
  text-align: center;
}

.c-th-owned-contracts,
.c-cell-contracts-owned,
.c-th-space-used,
.c-cell-space {
  min-width: 8.75rem;
  text-align: center;
}

.c-th-space-share,
.c-cell-space-share {
  min-width: 9.25rem;
  text-align: center;
}

.c-cell-deleted {
  text-align: center;
}
</style>
`] }, media: void 0 });
};
var __vue_scope_id__ = "data-v-1a0916c5";
var __vue_module_identifier__ = void 0;
var __vue_is_functional_template__ = false;
function __vue_normalize__(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang='pug'>
PageTemplate
  template(#title='') {{ L('Users') }}

  InfoCard(v-if='live.error' :heading='L("Note")') {{ live.error }}

  .is-centered-on-mobile(v-else-if='live.data')
    section.c-user-stats-section
      i18n.section-title Stats

      .c-stat-cards
        StatCard(v-for='(item, index) in userStats'
          :key='item.id'
          :description='item.name'
          :stat='item.value'
          :icon='item.icon'
          :color='index % 2 === 0 ? "blue" : "purple"'
        )

    section.c-user-table
      i18n.section-title Usage by user

      .summary-list.c-user-usages
        .c-table-wrapper
          table.table.c-table
            thead
              tr
                i18n.c-th-user(tag='th') User
                i18n.c-th-owned-contracts(tag='th') Contracts owned
                i18n.c-th-owned-files(tag='th') Files owned
                i18n.c-th-space-used(tag='th') Space used
                i18n.c-th-space-share(tag='th') Share of storage
                i18n.c-th-credits(tag='th') Credits

            tbody
              tr(v-for='item in live.data' :key='item.username')
                td.c-cell-name.has-text-bold {{ item.username }}
                td.c-cell-deleted(v-if='item.deleted' colspan='5')
                  i18n.pill.is-danger(tag='span') Account deleted
                template(v-else)
                  td.c-cell-contracts-owned {{ item.ownedContracts }}
                  td.c-cell-files-owned {{ item.ownedFiles }}
                  td.c-cell-space {{ humanBytes(item.size) }}
                  td.c-cell-space-share {{ shareOf(item.size) }}
                  td.c-cell-credits(:class='{ "has-text-danger": item.picocredits.startsWith("-") }') {{ credits(item.picocredits) }}
</template>

<script>
import PageTemplate from './PageTemplate.vue'
import StatCard from '../../../../../src/serve/dashboard/views/components/StatCard.vue'
import InfoCard from '../../../../../src/serve/dashboard/views/components/InfoCard.vue'
import L from '../../../../../src/serve/dashboard/common/translations.js'
import liveData from '../../../../../src/serve/dashboard/views/utils/liveData.js'
import { credits, humanBytes } from '../../../../../src/serve/dashboard/views/utils/format.js'

export default {
  name: 'Users',
  mixins: [liveData('users')],
  components: {
    PageTemplate,
    StatCard,
    InfoCard
  },
  computed: {
    liveUsers () {
      return this.live.data.filter(user => !user.deleted)
    },
    totalSize () {
      return this.liveUsers.reduce((sum, user) => sum + user.size, 0)
    },
    userStats () {
      return [
        { id: 'users', name: L('Users'), value: this.liveUsers.length, icon: 'users' },
        { id: 'deleted', name: L('Deleted accounts'), value: this.live.data.length - this.liveUsers.length, icon: 'trend-down' },
        { id: 'storage', name: L('Storage used'), value: humanBytes(this.totalSize), icon: 'battery-charging' }
      ]
    }
  },
  methods: {
    credits,
    humanBytes,
    shareOf (size) {
      return this.totalSize ? \`\${(100 * size / this.totalSize).toFixed(1)}%\` : '0%'
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-stat-cards {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.c-user-usages {
  max-width: max-content;
}

.c-user-table {
  margin-top: 3rem;
}

.c-table-wrapper {
  position: relative;
  overflow-x: auto;
  max-width: 100%;
}

.c-table {
  position: relative;
  height: max-content;
}

.c-th-user,
.c-cell-name {
  position: sticky;
  left: 0;
  padding: 0 0.8rem 0 0.2rem;
  background-color: var(--summary-list-bg-color);
  min-width: 8rem;
}

.c-cell-name {
  line-height: 1.4;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.c-th-owned-files,
.c-cell-files-owned,
.c-th-credits,
.c-cell-credits {
  min-width: 6.25rem;
  text-align: center;
}

.c-th-owned-contracts,
.c-cell-contracts-owned,
.c-th-space-used,
.c-cell-space {
  min-width: 8.75rem;
  text-align: center;
}

.c-th-space-share,
.c-cell-space-share {
  min-width: 9.25rem;
  text-align: center;
}

.c-cell-deleted {
  text-align: center;
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
var Users_default = __vue_component__;
export {
  Users_default as default
};
