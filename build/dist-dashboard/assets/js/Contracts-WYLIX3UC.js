import {
  OPEN_MODAL
} from "./chunk-JAZDRYJA.js";
import {
  humanBytes,
  liveData_default
} from "./chunk-34AVBA6C.js";
import "./chunk-LFSZ3O36.js";
import {
  InfoCard_default
} from "./chunk-QZCHUD6N.js";
import {
  Dropdown_default
} from "./chunk-HIDYDI3R.js";
import {
  PageTemplate_default
} from "./chunk-3KF7JRLD.js";
import {
  L
} from "./chunk-ZI2WDK4P.js";
import {
  esm_default
} from "./chunk-UHFMZPCY.js";

// src/serve/dashboard/views/pages/Contracts.vue
var ALL_CONTRACTS = { id: "all-contracts", name: L("All contracts") };
var PILLS = ["is-warning", "is-purple-1", "is-blue-1", "is-green-1", "is-neautral"];
var __vue_script__ = {
  name: "Contracts",
  mixins: [liveData_default("contracts")],
  components: {
    PageTemplate: PageTemplate_default,
    Dropdown: Dropdown_default,
    InfoCard: InfoCard_default
  },
  data() {
    return {
      ephemeral: {
        contractFilter: ALL_CONTRACTS
      }
    };
  },
  computed: {
    types() {
      return [...new Set(this.live.data.map((item) => item.type).filter(Boolean))].sort();
    },
    filterOptions() {
      return [ALL_CONTRACTS, ...this.types.map((type) => ({ id: type, name: type }))];
    },
    filteredContracts() {
      const filterId = this.ephemeral.contractFilter.id;
      return this.live.data.filter((item) => filterId === ALL_CONTRACTS.id || item.type === filterId);
    }
  },
  methods: {
    humanBytes,
    onFilterSelect(item) {
      this.ephemeral.contractFilter = item;
    },
    viewManifest(item) {
      esm_default("okTurtles.events/emit", OPEN_MODAL, "ViewContractManifestModal", { contract: item });
    },
    pillFor(type) {
      const index = this.types.indexOf(type);
      return index === -1 ? "is-neautral" : PILLS[index % PILLS.length];
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
      staticClass: "c-page-contracts",
      scopedSlots: _vm._u([
        {
          key: "title",
          fn: function() {
            return [_vm._v(_vm._s(_vm.L("Contracts")))];
          },
          proxy: true
        }
      ])
    },
    [
      _vm.live.data ? _c("Dropdown", {
        staticClass: "c-filter-menu",
        attrs: {
          defaultItemId: "all-contracts",
          isOverlayStyle: true,
          options: _vm.filterOptions
        },
        on: { select: _vm.onFilterSelect }
      }) : _vm._e(),
      _vm.live.error ? _c("InfoCard", { attrs: { heading: _vm.L("Note") } }, [
        _vm._v(_vm._s(_vm.live.error))
      ]) : _vm.live.data ? _c("section", { staticClass: "c-contracts-list-container" }, [
        _c("div", { staticClass: "summary-list c-contracts-list" }, [
          _c("div", { staticClass: "c-table-wrapper" }, [
            _c("table", { staticClass: "table c-contract-ids-table" }, [
              _c("thead", [
                _c(
                  "tr",
                  [
                    _c(
                      "i18n",
                      {
                        staticClass: "c-th-contract-id",
                        attrs: { tag: "th" }
                      },
                      [_vm._v("contractID")]
                    ),
                    _c(
                      "i18n",
                      { staticClass: "c-th-type", attrs: { tag: "th" } },
                      [_vm._v("Type")]
                    ),
                    _c(
                      "i18n",
                      { staticClass: "c-th-size", attrs: { tag: "th" } },
                      [_vm._v("Size")]
                    ),
                    _c(
                      "i18n",
                      {
                        staticClass: "c-th-messages",
                        attrs: { tag: "th" }
                      },
                      [_vm._v("Messages")]
                    ),
                    _c(
                      "i18n",
                      { staticClass: "c-th-owner", attrs: { tag: "th" } },
                      [_vm._v("Belongs to")]
                    ),
                    _c(
                      "i18n",
                      { staticClass: "c-th-action", attrs: { tag: "th" } },
                      [_vm._v("Action")]
                    )
                  ],
                  1
                )
              ]),
              _c(
                "tbody",
                _vm._l(_vm.filteredContracts, function(item) {
                  return _c("tr", { key: item.contractID }, [
                    _c("td", { staticClass: "c-cell-contract-id" }, [
                      _vm._v(_vm._s(item.contractID))
                    ]),
                    _c("td", { staticClass: "c-cell-type" }, [
                      _c(
                        "span",
                        {
                          staticClass: "pill",
                          class: _vm.pillFor(item.type)
                        },
                        [_vm._v(_vm._s(item.type || _vm.L("Unknown")))]
                      )
                    ]),
                    _c("td", { staticClass: "c-cell-size" }, [
                      _vm._v(_vm._s(_vm.humanBytes(item.size)))
                    ]),
                    _c("td", { staticClass: "c-cell-messages" }, [
                      _vm._v(_vm._s(item.messages))
                    ]),
                    _c("td", { staticClass: "c-cell-owner" }, [
                      _vm._v(
                        _vm._s(
                          item.name || item.ownerName || item.owner || _vm.L("None")
                        )
                      )
                    ]),
                    _c(
                      "td",
                      { staticClass: "c-cell-action" },
                      [
                        _c(
                          "i18n",
                          {
                            staticClass: "is-extra-small has-blue-background",
                            attrs: { tag: "button" },
                            on: {
                              click: function($event) {
                                return _vm.viewManifest(item);
                              }
                            }
                          },
                          [_vm._v("view")]
                        )
                      ],
                      1
                    )
                  ]);
                }),
                0
              )
            ])
          ])
        ])
      ]) : _vm._e()
    ],
    1
  );
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
var __vue_inject_styles__ = function(inject) {
  if (!inject) return;
  inject("data-v-277ea42e_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-277ea42e]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-277ea42e] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-page-contracts[data-v-277ea42e] {\n  position: relative;\n}\n.c-filter-menu[data-v-277ea42e] {\n  position: absolute !important;\n  top: 2rem;\n  right: 1rem;\n}\n.c-filter-menu[data-v-277ea42e]  .c-dropdown-trigger {\n  min-width: 8.75rem;\n}\n.c-contracts-list[data-v-277ea42e] {\n  position: relative;\n  display: flex;\n  flex-direction: row;\n  align-items: flex-start;\n  max-width: max-content;\n}\n.c-table-wrapper[data-v-277ea42e] {\n  position: relative;\n  overflow-x: auto;\n  max-width: 100%;\n}\n.c-contract-ids-table[data-v-277ea42e] {\n  position: relative;\n  height: max-content;\n}\n.c-th-contract-id[data-v-277ea42e],\n.c-cell-contract-id[data-v-277ea42e] {\n  position: sticky;\n  left: 0;\n  padding: 0 0.8rem 0 0.2rem;\n  background-color: var(--summary-list-bg-color);\n  overflow: hidden;\n}\n.c-cell-contract-id[data-v-277ea42e] {\n  display: block;\n  max-width: 10.75rem;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  direction: rtl;\n}\n@media screen and (max-width: 440px) {\n.c-cell-contract-id[data-v-277ea42e] {\n    max-width: 7.25rem;\n}\n}\n.c-th-type[data-v-277ea42e],\n.c-cell-type[data-v-277ea42e] {\n  padding-left: 2.75rem;\n}\n@media screen and (max-width: 440px) {\n.c-th-type[data-v-277ea42e],\n  .c-cell-type[data-v-277ea42e] {\n    padding-left: 1.85rem;\n}\n}\n.c-th-size[data-v-277ea42e],\n.c-cell-size[data-v-277ea42e] {\n  min-width: 7.25rem;\n  text-align: right;\n}\n@media screen and (max-width: 440px) {\n.c-th-size[data-v-277ea42e],\n  .c-cell-size[data-v-277ea42e] {\n    min-width: 6.25rem;\n}\n}\n.c-th-messages[data-v-277ea42e],\n.c-cell-messages[data-v-277ea42e] {\n  min-width: 11.25rem;\n  text-align: center;\n}\n@media screen and (max-width: 440px) {\n.c-th-messages[data-v-277ea42e],\n  .c-cell-messages[data-v-277ea42e] {\n    min-width: 9.75rem;\n}\n}\n.c-th-owner[data-v-277ea42e],\n.c-cell-owner[data-v-277ea42e] {\n  min-width: 7.75rem;\n  max-width: 12rem;\n  text-align: right;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.c-th-action[data-v-277ea42e],\n.c-cell-action[data-v-277ea42e] {\n  min-width: 6.75rem;\n  text-align: right;\n  padding-right: 0.75rem;\n}\n\n/*# sourceMappingURL=Contracts.vue.map */", map: { "version": 3, "sources": ["Contracts.vue", "src/serve/dashboard/views/pages/Contracts.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AC6GtB,qBAAA;AD3GA;ECkHA,kCAAA;EAAA,iCAAA;EAAA,2CAAA;EAAA,iDAAA;EAAA,oCAAA;EAAA,sDAAA;EAAA,+CAAA;EAAA,qDAAA;EAAA,qCAAA;EAAA,4DAAA;EAAA,sDAAA;EAAA,mCAAA;EAAA,8CAAA;EAAA,0CAAA;EAAA,+BAAA;EAAA,gDAAA;EAAA,sDAAA;EAAA,4CAAA;EAAA,wCAAA;EAAA,iCAAA;EAAA,4BAAA;EAAA,mCAAA;EAAA,wDAAA;EAAA,6BAAA;EAAA,8BAAA;EAAA,gCAAA;EAAA,6CAAA;EAAA,sBAAA;EAAA,qCAAA;EAAA,0BAAA;EAAA,kCAAA;EAAA,6CAAA;EAAA,mCAAA;EAAA,qCAAA;EAAA,uCAAA;EAAA,+DAAA;EAAA,2CAAA;EAAA,0BAAA;EAAA,2HAAA;EAAA,qCAAA;EAAA,iBAAA;EAAA,+BAAA;ADvEA;AC4EA;EAIA,kCAAA;EAAA,oCAAA;EAAA,2CAAA;EAAA,8CAAA;EAAA,iCAAA;EAAA,uDAAA;EAAA,4CAAA;EAAA,kDAAA;EAAA,wCAAA;EAAA,iDAAA;EAAA,4DAAA;EAAA,mCAAA;EAAA,sDAAA;EAAA,0CAAA;EAAA,+BAAA;EAAA,6CAAA;EAAA,mDAAA;EAAA,iCAAA;EAAA,wCAAA;EAAA,iCAAA;EAAA,4BAAA;EAAA,mCAAA;EAAA,+CAAA;EAAA,gCAAA;EAAA,8BAAA;EAAA,gCAAA;EAAA,0CAAA;EAAA,yBAAA;EAAA,yCAAA;EAAA,+CAAA;EAAA,kCAAA;EAAA,+BAAA;EAAA,mCAAA;EAAA,qCAAA;EAAA,uCAAA;EAAA,mDAAA;EAAA,8CAAA;EAAA,6BAAA;EAAA,sIAAA;EAAA,0BAAA;EAAA,iBAAA;EAAA,uCAAA;ADnCA;ACSA;EACA,kBAAA;ADNA;ACSA;EACA,6BAAA;EACA,SAAA;EACA,WAAA;ADNA;ACQA;EACA,kBAAA;ADNA;ACUA;EACA,kBAAA;EACA,aAAA;EACA,mBAAA;EACA,uBAAA;EACA,sBAAA;ADPA;ACUA;EACA,kBAAA;EACA,gBAAA;EACA,eAAA;ADPA;ACUA;EACA,kBAAA;EACA,mBAAA;ADPA;ACUA;;EAEA,gBAAA;EACA,OAAA;EACA,0BAAA;EACA,8CAAA;EACA,gBAAA;ADPA;ACUA;EACA,cAAA;EACA,mBAAA;EACA,gBAAA;EACA,mBAAA;EACA,uBAAA;EACA,cAAA;ADPA;AACA;ACAA;IASA,kBAAA;ADNE;AACF;ACSA;;EAEA,qBAAA;ADNA;AACA;ACGA;;IAKA,qBAAA;ADJE;AACF;ACOA;;EAEA,kBAAA;EACA,iBAAA;ADJA;AACA;ACAA;;IAMA,kBAAA;ADFE;AACF;ACKA;;EAEA,mBAAA;EACA,kBAAA;ADFA;AACA;ACFA;;IAMA,kBAAA;ADAE;AACF;ACGA;;EAEA,kBAAA;EACA,gBAAA;EACA,iBAAA;EACA,gBAAA;EACA,mBAAA;EACA,uBAAA;ADAA;ACGA;;EAEA,kBAAA;EACA,iBAAA;EACA,sBAAA;ADAA;;AAEA,wCAAwC", "file": "Contracts.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-page-contracts {\n  position: relative;\n}\n\n.c-filter-menu {\n  position: absolute !important;\n  top: 2rem;\n  right: 1rem;\n}\n.c-filter-menu ::v-deep .c-dropdown-trigger {\n  min-width: 8.75rem;\n}\n\n.c-contracts-list {\n  position: relative;\n  display: flex;\n  flex-direction: row;\n  align-items: flex-start;\n  max-width: max-content;\n}\n\n.c-table-wrapper {\n  position: relative;\n  overflow-x: auto;\n  max-width: 100%;\n}\n\n.c-contract-ids-table {\n  position: relative;\n  height: max-content;\n}\n\n.c-th-contract-id,\n.c-cell-contract-id {\n  position: sticky;\n  left: 0;\n  padding: 0 0.8rem 0 0.2rem;\n  background-color: var(--summary-list-bg-color);\n  overflow: hidden;\n}\n\n.c-cell-contract-id {\n  display: block;\n  max-width: 10.75rem;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  direction: rtl;\n}\n@media screen and (max-width: 440px) {\n  .c-cell-contract-id {\n    max-width: 7.25rem;\n  }\n}\n\n.c-th-type,\n.c-cell-type {\n  padding-left: 2.75rem;\n}\n@media screen and (max-width: 440px) {\n  .c-th-type,\n  .c-cell-type {\n    padding-left: 1.85rem;\n  }\n}\n\n.c-th-size,\n.c-cell-size {\n  min-width: 7.25rem;\n  text-align: right;\n}\n@media screen and (max-width: 440px) {\n  .c-th-size,\n  .c-cell-size {\n    min-width: 6.25rem;\n  }\n}\n\n.c-th-messages,\n.c-cell-messages {\n  min-width: 11.25rem;\n  text-align: center;\n}\n@media screen and (max-width: 440px) {\n  .c-th-messages,\n  .c-cell-messages {\n    min-width: 9.75rem;\n  }\n}\n\n.c-th-owner,\n.c-cell-owner {\n  min-width: 7.75rem;\n  max-width: 12rem;\n  text-align: right;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\n.c-th-action,\n.c-cell-action {\n  min-width: 6.75rem;\n  text-align: right;\n  padding-right: 0.75rem;\n}\n\n/*# sourceMappingURL=Contracts.vue.map */", `<template lang='pug'>
PageTemplate.c-page-contracts
  template(#title='') {{ L('Contracts') }}

  Dropdown.c-filter-menu(
    v-if='live.data'
    defaultItemId='all-contracts'
    :isOverlayStyle='true'
    :options='filterOptions'
    @select='onFilterSelect'
  )

  InfoCard(v-if='live.error' :heading='L("Note")') {{ live.error }}

  section.c-contracts-list-container(v-else-if='live.data')
    .summary-list.c-contracts-list
      .c-table-wrapper
        table.table.c-contract-ids-table
          thead
            tr
              i18n.c-th-contract-id(tag='th') contractID
              i18n.c-th-type(tag='th') Type
              i18n.c-th-size(tag='th') Size
              i18n.c-th-messages(tag='th') Messages
              i18n.c-th-owner(tag='th') Belongs to
              i18n.c-th-action(tag='th') Action

          tbody
            tr(v-for='item in filteredContracts' :key='item.contractID')
              td.c-cell-contract-id {{ item.contractID }}
              td.c-cell-type
                span.pill(:class='pillFor(item.type)') {{ item.type || L('Unknown') }}
              td.c-cell-size {{ humanBytes(item.size) }}
              td.c-cell-messages {{ item.messages }}
              td.c-cell-owner {{ item.name || item.ownerName || item.owner || L('None') }}
              td.c-cell-action
                i18n.is-extra-small.has-blue-background(tag='button' @click='viewManifest(item)') view
</template>

<script>
import sbp from '@sbp/sbp'
import PageTemplate from './PageTemplate.vue'
import Dropdown from '../../../../../src/serve/dashboard/views/components/forms/Dropdown.vue'
import InfoCard from '../../../../../src/serve/dashboard/views/components/InfoCard.vue'
import L from '../../../../../src/serve/dashboard/common/translations.js'
import liveData from '../../../../../src/serve/dashboard/views/utils/liveData.js'
import { humanBytes } from '../../../../../src/serve/dashboard/views/utils/format.js'
import { OPEN_MODAL } from '../../../../../src/serve/dashboard/views/utils/events.js'

const ALL_CONTRACTS = { id: 'all-contracts', name: L('All contracts') }
// The pill colors there are, given out to the types in sorted order
const PILLS = ['is-warning', 'is-purple-1', 'is-blue-1', 'is-green-1', 'is-neautral']

export default {
  name: 'Contracts',
  mixins: [liveData('contracts')],
  components: {
    PageTemplate,
    Dropdown,
    InfoCard
  },
  data () {
    return {
      ephemeral: {
        contractFilter: ALL_CONTRACTS
      }
    }
  },
  computed: {
    types () {
      return [...new Set(this.live.data.map(item => item.type).filter(Boolean))].sort()
    },
    filterOptions () {
      return [ALL_CONTRACTS, ...this.types.map(type => ({ id: type, name: type }))]
    },
    filteredContracts () {
      const filterId = this.ephemeral.contractFilter.id
      return this.live.data
        .filter(item => filterId === ALL_CONTRACTS.id || item.type === filterId)
    }
  },
  methods: {
    humanBytes,
    onFilterSelect (item) {
      this.ephemeral.contractFilter = item
    },
    viewManifest (item) {
      sbp('okTurtles.events/emit', OPEN_MODAL, 'ViewContractManifestModal', { contract: item })
    },
    pillFor (type) {
      const index = this.types.indexOf(type)
      return index === -1 ? 'is-neautral' : PILLS[index % PILLS.length]
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-page-contracts {
  position: relative;
}

.c-filter-menu {
  position: absolute !important;
  top: 2rem;
  right: 1rem;

  ::v-deep .c-dropdown-trigger {
    min-width: 8.75rem;
  }
}

.c-contracts-list {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: max-content;
}

.c-table-wrapper {
  position: relative;
  overflow-x: auto;
  max-width: 100%;
}

.c-contract-ids-table {
  position: relative;
  height: max-content;
}

.c-th-contract-id,
.c-cell-contract-id {
  position: sticky;
  left: 0;
  padding: 0 0.8rem 0 0.2rem;
  background-color: var(--summary-list-bg-color);
  overflow: hidden;
}

.c-cell-contract-id {
  display: block;
  max-width: 10.75rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  direction: rtl;

  @include phone_narrow {
    max-width: 7.25rem;
  }
}

.c-th-type,
.c-cell-type {
  padding-left: 2.75rem;

  @include phone_narrow {
    padding-left: 1.85rem;
  }
}

.c-th-size,
.c-cell-size {
  min-width: 7.25rem;
  text-align: right;

  @include phone_narrow {
    min-width: 6.25rem;
  }
}

.c-th-messages,
.c-cell-messages {
  min-width: 11.25rem;
  text-align: center;

  @include phone_narrow {
    min-width: 9.75rem;
  }
}

.c-th-owner,
.c-cell-owner {
  min-width: 7.75rem;
  max-width: 12rem;
  text-align: right;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.c-th-action,
.c-cell-action {
  min-width: 6.75rem;
  text-align: right;
  padding-right: 0.75rem;
}
</style>
`] }, media: void 0 });
};
var __vue_scope_id__ = "data-v-277ea42e";
var __vue_module_identifier__ = void 0;
var __vue_is_functional_template__ = false;
function __vue_normalize__(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang='pug'>
PageTemplate.c-page-contracts
  template(#title='') {{ L('Contracts') }}

  Dropdown.c-filter-menu(
    v-if='live.data'
    defaultItemId='all-contracts'
    :isOverlayStyle='true'
    :options='filterOptions'
    @select='onFilterSelect'
  )

  InfoCard(v-if='live.error' :heading='L("Note")') {{ live.error }}

  section.c-contracts-list-container(v-else-if='live.data')
    .summary-list.c-contracts-list
      .c-table-wrapper
        table.table.c-contract-ids-table
          thead
            tr
              i18n.c-th-contract-id(tag='th') contractID
              i18n.c-th-type(tag='th') Type
              i18n.c-th-size(tag='th') Size
              i18n.c-th-messages(tag='th') Messages
              i18n.c-th-owner(tag='th') Belongs to
              i18n.c-th-action(tag='th') Action

          tbody
            tr(v-for='item in filteredContracts' :key='item.contractID')
              td.c-cell-contract-id {{ item.contractID }}
              td.c-cell-type
                span.pill(:class='pillFor(item.type)') {{ item.type || L('Unknown') }}
              td.c-cell-size {{ humanBytes(item.size) }}
              td.c-cell-messages {{ item.messages }}
              td.c-cell-owner {{ item.name || item.ownerName || item.owner || L('None') }}
              td.c-cell-action
                i18n.is-extra-small.has-blue-background(tag='button' @click='viewManifest(item)') view
</template>

<script>
import sbp from '@sbp/sbp'
import PageTemplate from './PageTemplate.vue'
import Dropdown from '../../../../../src/serve/dashboard/views/components/forms/Dropdown.vue'
import InfoCard from '../../../../../src/serve/dashboard/views/components/InfoCard.vue'
import L from '../../../../../src/serve/dashboard/common/translations.js'
import liveData from '../../../../../src/serve/dashboard/views/utils/liveData.js'
import { humanBytes } from '../../../../../src/serve/dashboard/views/utils/format.js'
import { OPEN_MODAL } from '../../../../../src/serve/dashboard/views/utils/events.js'

const ALL_CONTRACTS = { id: 'all-contracts', name: L('All contracts') }
// The pill colors there are, given out to the types in sorted order
const PILLS = ['is-warning', 'is-purple-1', 'is-blue-1', 'is-green-1', 'is-neautral']

export default {
  name: 'Contracts',
  mixins: [liveData('contracts')],
  components: {
    PageTemplate,
    Dropdown,
    InfoCard
  },
  data () {
    return {
      ephemeral: {
        contractFilter: ALL_CONTRACTS
      }
    }
  },
  computed: {
    types () {
      return [...new Set(this.live.data.map(item => item.type).filter(Boolean))].sort()
    },
    filterOptions () {
      return [ALL_CONTRACTS, ...this.types.map(type => ({ id: type, name: type }))]
    },
    filteredContracts () {
      const filterId = this.ephemeral.contractFilter.id
      return this.live.data
        .filter(item => filterId === ALL_CONTRACTS.id || item.type === filterId)
    }
  },
  methods: {
    humanBytes,
    onFilterSelect (item) {
      this.ephemeral.contractFilter = item
    },
    viewManifest (item) {
      sbp('okTurtles.events/emit', OPEN_MODAL, 'ViewContractManifestModal', { contract: item })
    },
    pillFor (type) {
      const index = this.types.indexOf(type)
      return index === -1 ? 'is-neautral' : PILLS[index % PILLS.length]
    }
  }
}
<\/script>

<style lang="scss" scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-page-contracts {
  position: relative;
}

.c-filter-menu {
  position: absolute !important;
  top: 2rem;
  right: 1rem;

  ::v-deep .c-dropdown-trigger {
    min-width: 8.75rem;
  }
}

.c-contracts-list {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: max-content;
}

.c-table-wrapper {
  position: relative;
  overflow-x: auto;
  max-width: 100%;
}

.c-contract-ids-table {
  position: relative;
  height: max-content;
}

.c-th-contract-id,
.c-cell-contract-id {
  position: sticky;
  left: 0;
  padding: 0 0.8rem 0 0.2rem;
  background-color: var(--summary-list-bg-color);
  overflow: hidden;
}

.c-cell-contract-id {
  display: block;
  max-width: 10.75rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  direction: rtl;

  @include phone_narrow {
    max-width: 7.25rem;
  }
}

.c-th-type,
.c-cell-type {
  padding-left: 2.75rem;

  @include phone_narrow {
    padding-left: 1.85rem;
  }
}

.c-th-size,
.c-cell-size {
  min-width: 7.25rem;
  text-align: right;

  @include phone_narrow {
    min-width: 6.25rem;
  }
}

.c-th-messages,
.c-cell-messages {
  min-width: 11.25rem;
  text-align: center;

  @include phone_narrow {
    min-width: 9.75rem;
  }
}

.c-th-owner,
.c-cell-owner {
  min-width: 7.75rem;
  max-width: 12rem;
  text-align: right;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.c-th-action,
.c-cell-action {
  min-width: 6.75rem;
  text-align: right;
  padding-right: 0.75rem;
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
var Contracts_default = __vue_component__;
export {
  Contracts_default as default
};
