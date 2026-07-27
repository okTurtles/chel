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
  L,
  cloneDeep
} from "./chunk-ZI2WDK4P.js";
import "./chunk-UHFMZPCY.js";

// src/serve/dashboard/views/components/PaymentMethods.vue
var genRandomId = () => Math.random().toString(20).slice(2);
var __vue_script__ = {
  name: "PaymentMethods",
  props: {
    methods: {
      type: Array,
      required: true
    }
  },
  components: {
    Dropdown: Dropdown_default
  },
  computed: {
    showAddMore() {
      return this.ephemeral.paymentMethods.length < this.config.methodOptions.length;
    }
  },
  data() {
    return {
      config: {
        methodOptions: [
          { id: "paypal", name: "Paypal" },
          { id: "bitcoin", name: "Bitcoin" },
          { id: "venmo", name: "Venmo" }
        ]
      },
      ephemeral: {
        paymentMethods: [
          { id: genRandomId(), method: null, detail: "" }
        ]
      },
      syncDebounceId: null
    };
  },
  methods: {
    onDropdownSelect(targetId, selectedItem) {
      const found = this.ephemeral.paymentMethods.find((x) => x.id === targetId);
      found.method = selectedItem;
      this.$emit("update:methods", cloneDeep(this.ephemeral.paymentMethods));
    },
    addEntry() {
      this.ephemeral.paymentMethods.push({ id: genRandomId(), method: null, detail: "" });
    },
    deleteEntry(targetId) {
      const index = this.ephemeral.paymentMethods.findIndex((x) => x.id === targetId);
      this.ephemeral.paymentMethods.splice(index, 1);
    },
    debouncedMethodsSync() {
      if (this.syncDebounceId) {
        clearTimeout(this.syncDebounceId);
      }
      this.syncDebounceId = setTimeout(() => {
        this.$emit("update:methods", cloneDeep(this.ephemeral.paymentMethods));
      }, 800);
    }
  },
  updated() {
    this.debouncedMethodsSync();
  }
};
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "c-payment-methods-container" },
    [
      _vm._l(_vm.ephemeral.paymentMethods, function(item) {
        return _c("div", { key: item.id, staticClass: "c-entry" }, [
          _c(
            "div",
            { staticClass: "inputgroup c-method-group" },
            [
              _c("Dropdown", {
                staticClass: "c-method-dropdown",
                attrs: {
                  defaultText: _vm.L("Choose..."),
                  options: _vm.config.methodOptions,
                  isOverlayStyle: true
                },
                on: {
                  select: function($event) {
                    return _vm.onDropdownSelect(item.id, $event);
                  }
                }
              }),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: item.detail,
                    expression: "item.detail"
                  }
                ],
                staticClass: "input no-label c-method-input",
                attrs: { type: "text" },
                domProps: { value: item.detail },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return;
                    }
                    _vm.$set(item, "detail", $event.target.value);
                  }
                }
              })
            ],
            1
          ),
          _vm.ephemeral.paymentMethods.length > 1 ? _c(
            "button",
            {
              staticClass: "is-icon c-delete-entry-btn",
              on: {
                click: function($event) {
                  return _vm.deleteEntry(item.id);
                }
              }
            },
            [_c("i", { staticClass: "icon-minus-circle" })]
          ) : _vm._e()
        ]);
      }),
      _c("div", { staticClass: "c-add-more" }, [
        _vm.showAddMore ? _c(
          "button",
          {
            staticClass: "is-unstyled c-add-more-btn",
            attrs: { type: "button" },
            on: { click: _vm.addEntry }
          },
          [
            _c("i", { staticClass: "icon-plus-circle" }),
            _c("i18n", { staticClass: "is-inline-block" }, [
              _vm._v("Add more")
            ])
          ],
          1
        ) : _vm._e()
      ])
    ],
    2
  );
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
var __vue_inject_styles__ = function(inject) {
  if (!inject) return;
  inject("data-v-44b56f70_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-44b56f70]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-44b56f70] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-payment-methods-container[data-v-44b56f70] {\n  position: relative;\n}\n.c-entry[data-v-44b56f70] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n.inputgroup .c-method-input[data-v-44b56f70] {\n  height: 2.5rem;\n  border-radius: 0 0.5rem 0.5rem 0;\n  border: 1px solid var(--text_1);\n}\n.c-method-dropdown[data-v-44b56f70]  .c-dropdown-trigger {\n  border-radius: 0.5rem 0 0 0.5rem;\n}\n.c-method-dropdown[data-v-44b56f70]  .c-dropdown-trigger:hover {\n  box-shadow: none;\n}\n.c-delete-entry-btn[data-v-44b56f70] {\n  flex-shrink: 0;\n  border-radius: 50%;\n  width: 2.25rem;\n  height: 2.25rem;\n  margin-left: 0.5rem;\n  border: 1px solid rgba(0, 0, 0, 0);\n  background-color: var(--background_active);\n  transition: box-shadow 200ms, border-color 120ms;\n}\n.c-delete-entry-btn[data-v-44b56f70]:hover, .c-delete-entry-btn[data-v-44b56f70]:focus {\n  border-color: var(--border);\n  box-shadow: 0 0 4px var(--background_active);\n}\n.c-delete-entry-btn[data-v-44b56f70]:active {\n  border-color: var(--text_1);\n}\n.c-add-more[data-v-44b56f70] {\n  display: flex;\n  justify-content: flex-end;\n}\nbutton.c-add-more-btn[data-v-44b56f70] {\n  display: inline-flex;\n  align-items: center;\n  font-size: 0.75rem;\n  font-weight: 600;\n  padding: 0.25rem 0.5rem;\n  border-radius: 0.5rem;\n  border: 1px solid rgba(0, 0, 0, 0);\n  background-color: var(--background_active);\n  transition: box-shadow 200ms, border-color 120ms;\n}\nbutton.c-add-more-btn[data-v-44b56f70]:hover, button.c-add-more-btn[data-v-44b56f70]:focus {\n  border-color: var(--border);\n  box-shadow: 0 0 4px var(--background_active);\n}\nbutton.c-add-more-btn[data-v-44b56f70]:active {\n  border-color: var(--text_1);\n}\nbutton.c-add-more-btn > i[data-v-44b56f70] {\n  position: relative;\n  display: inline-block;\n  font-size: 1.25em;\n  margin-right: 0.15rem;\n  transform: translateY(2px);\n}\n\n/*# sourceMappingURL=PaymentMethods.vue.map */", map: { "version": 3, "sources": ["PaymentMethods.vue", "src/serve/dashboard/views/components/PaymentMethods.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AC6GtB,qBAAA;AAGA;EAIA,kCAAA;EAAA,iCAAA;EAAA,2CAAA;EAAA,iDAAA;EAAA,oCAAA;EAAA,sDAAA;EAAA,+CAAA;EAAA,qDAAA;EAAA,qCAAA;EAAA,4DAAA;EAAA,sDAAA;EAAA,mCAAA;EAAA,8CAAA;EAAA,0CAAA;EAAA,+BAAA;EAAA,gDAAA;EAAA,sDAAA;EAAA,4CAAA;EAAA,wCAAA;EAAA,iCAAA;EAAA,4BAAA;EAAA,mCAAA;EAAA,wDAAA;EAAA,6BAAA;EAAA,8BAAA;EAAA,gCAAA;EAAA,6CAAA;EAAA,sBAAA;EAAA,qCAAA;EAAA,0BAAA;EAAA,kCAAA;EAAA,6CAAA;EAAA,mCAAA;EAAA,qCAAA;EAAA,uCAAA;EAAA,+DAAA;EAAA,2CAAA;EAAA,0BAAA;EAAA,2HAAA;EAAA,qCAAA;EAAA,iBAAA;EAAA,+BAAA;ADvEA;AC4EA;EAIA,kCAAA;EAAA,oCAAA;EAAA,2CAAA;EAAA,8CAAA;EAAA,iCAAA;EAAA,uDAAA;EAAA,4CAAA;EAAA,kDAAA;EAAA,wCAAA;EAAA,iDAAA;EAAA,4DAAA;EAAA,mCAAA;EAAA,sDAAA;EAAA,0CAAA;EAAA,+BAAA;EAAA,6CAAA;EAAA,mDAAA;EAAA,iCAAA;EAAA,wCAAA;EAAA,iCAAA;EAAA,4BAAA;EAAA,mCAAA;EAAA,+CAAA;EAAA,gCAAA;EAAA,8BAAA;EAAA,gCAAA;EAAA,0CAAA;EAAA,yBAAA;EAAA,yCAAA;EAAA,+CAAA;EAAA,kCAAA;EAAA,+BAAA;EAAA,mCAAA;EAAA,qCAAA;EAAA,uCAAA;EAAA,mDAAA;EAAA,8CAAA;EAAA,6BAAA;EAAA,sIAAA;EAAA,0BAAA;EAAA,iBAAA;EAAA,uCAAA;ADnCA;AC0BA;EACA,kBAAA;ADvBA;AC0BA;EACA,kBAAA;EACA,aAAA;EACA,mBAAA;EACA,mBAAA;ADvBA;AC0BA;EACA,cAAA;EACA,gCAAA;EACA,+BAAA;ADvBA;AC2BA;EACA,gCAAA;ADxBA;AC0BA;EACA,gBAAA;ADxBA;AC6BA;EACA,cAAA;EACA,kBAAA;EACA,cAAA;EACA,eAAA;EACA,mBAAA;EAjDA,kCAAA;EACA,0CAAA;EACA,gDACA;ADuBA;ACpBA;EAEA,2BAAA;EACA,4CAAA;ADqBA;AClBA;EACA,2BAAA;ADoBA;ACoBA;EACA,aAAA;EACA,yBAAA;ADjBA;ACoBA;EACA,oBAAA;EACA,mBAAA;EACA,kBAAA;EACA,gBAAA;EACA,uBAAA;EACA,qBAAA;EAhEA,kCAAA;EACA,0CAAA;EACA,gDACA;AD+CA;AC5CA;EAEA,2BAAA;EACA,4CAAA;AD6CA;AC1CA;EACA,2BAAA;AD4CA;ACUA;EACA,kBAAA;EACA,qBAAA;EACA,iBAAA;EACA,qBAAA;EACA,0BAAA;ADRA;;AAEA,6CAA6C", "file": "PaymentMethods.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-payment-methods-container {\n  position: relative;\n}\n\n.c-entry {\n  position: relative;\n  display: flex;\n  align-items: center;\n  margin-bottom: 1rem;\n}\n\n.inputgroup .c-method-input {\n  height: 2.5rem;\n  border-radius: 0 0.5rem 0.5rem 0;\n  border: 1px solid var(--text_1);\n}\n\n.c-method-dropdown ::v-deep .c-dropdown-trigger {\n  border-radius: 0.5rem 0 0 0.5rem;\n}\n.c-method-dropdown ::v-deep .c-dropdown-trigger:hover {\n  box-shadow: none;\n}\n\n.c-delete-entry-btn {\n  flex-shrink: 0;\n  border-radius: 50%;\n  width: 2.25rem;\n  height: 2.25rem;\n  margin-left: 0.5rem;\n  border: 1px solid rgba(0, 0, 0, 0);\n  background-color: var(--background_active);\n  transition: box-shadow 200ms, border-color 120ms;\n}\n.c-delete-entry-btn:hover, .c-delete-entry-btn:focus {\n  border-color: var(--border);\n  box-shadow: 0 0 4px var(--background_active);\n}\n.c-delete-entry-btn:active {\n  border-color: var(--text_1);\n}\n\n.c-add-more {\n  display: flex;\n  justify-content: flex-end;\n}\n\nbutton.c-add-more-btn {\n  display: inline-flex;\n  align-items: center;\n  font-size: 0.75rem;\n  font-weight: 600;\n  padding: 0.25rem 0.5rem;\n  border-radius: 0.5rem;\n  border: 1px solid rgba(0, 0, 0, 0);\n  background-color: var(--background_active);\n  transition: box-shadow 200ms, border-color 120ms;\n}\nbutton.c-add-more-btn:hover, button.c-add-more-btn:focus {\n  border-color: var(--border);\n  box-shadow: 0 0 4px var(--background_active);\n}\nbutton.c-add-more-btn:active {\n  border-color: var(--text_1);\n}\nbutton.c-add-more-btn > i {\n  position: relative;\n  display: inline-block;\n  font-size: 1.25em;\n  margin-right: 0.15rem;\n  transform: translateY(2px);\n}\n\n/*# sourceMappingURL=PaymentMethods.vue.map */", `<template lang='pug'>
.c-payment-methods-container
  .c-entry(
    v-for='item in ephemeral.paymentMethods'
    :key='item.id'
  )
    .inputgroup.c-method-group
      Dropdown.c-method-dropdown(
        :defaultText='L("Choose...")'
        :options='config.methodOptions'
        :isOverlayStyle='true'
        @select='$event => onDropdownSelect(item.id, $event)'
      )
      input.input.no-label.c-method-input(type='text' v-model='item.detail')

    button.is-icon.c-delete-entry-btn(
      v-if='ephemeral.paymentMethods.length > 1'
      @click='deleteEntry(item.id)'
    )
      i.icon-minus-circle

  .c-add-more
    button.is-unstyled.c-add-more-btn(v-if='showAddMore' type='button' @click='addEntry')
      i.icon-plus-circle
      i18n.is-inline-block Add more
</template>

<script>
import Dropdown from '../../../../../src/serve/dashboard/views/components/forms/Dropdown.vue'
import { cloneDeep } from 'npm:turtledash'

const genRandomId = () => Math.random().toString(20).slice(2)

export default {
  name: 'PaymentMethods',
  props: {
    methods: {
      type: Array,
      required: true
    }
  },
  components: {
    Dropdown
  },
  computed: {
    showAddMore () {
      return this.ephemeral.paymentMethods.length < this.config.methodOptions.length
    }
  },
  data () {
    return {
      config: {
        methodOptions: [
          { id: 'paypal', name: 'Paypal' },
          { id: 'bitcoin', name: 'Bitcoin' },
          { id: 'venmo', name: 'Venmo' }
        ]
      },
      ephemeral: {
        paymentMethods: [
          { id: genRandomId(), method: null, detail: '' }
        ]
      },
      syncDebounceId: null
    }
  },
  methods: {
    onDropdownSelect (targetId, selectedItem) {
      const found = this.ephemeral.paymentMethods.find(x => x.id === targetId)
      found.method = selectedItem

      this.$emit('update:methods', cloneDeep(this.ephemeral.paymentMethods))
    },
    addEntry () {
      this.ephemeral.paymentMethods.push({ id: genRandomId(), method: null, detail: '' })
    },
    deleteEntry (targetId) {
      const index = this.ephemeral.paymentMethods.findIndex(x => x.id === targetId)
      this.ephemeral.paymentMethods.splice(index, 1)
    },
    debouncedMethodsSync () {
      if (this.syncDebounceId) {
        clearTimeout(this.syncDebounceId)
      }

      this.syncDebounceId = setTimeout(() => {
        this.$emit('update:methods', cloneDeep(this.ephemeral.paymentMethods))
      }, 800)
    }
  },
  updated () {
    this.debouncedMethodsSync()
  }
}
<\/script>

<style lang='scss' scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

@mixin button-common {
  border: 1px solid rgba(0, 0, 0, 0);
  background-color: $background_active;
  transition:
    box-shadow 200ms,
    border-color 120ms;

  &:hover,
  &:focus {
    border-color: $border;
    box-shadow: 0 0 4px $background_active;
  }

  &:active {
    border-color: $text_1;
  }
}

.c-payment-methods-container {
  position: relative;
}

.c-entry {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.inputgroup .c-method-input {
  height: 2.5rem;
  border-radius: 0 0.5rem 0.5rem 0;
  border: 1px solid $text_1;
}

.c-method-dropdown {
  ::v-deep .c-dropdown-trigger {
    border-radius: 0.5rem 0 0 0.5rem;

    &:hover {
      box-shadow: none;
    }
  }
}

.c-delete-entry-btn {
  flex-shrink: 0;
  border-radius: 50%;
  width: 2.25rem;
  height: 2.25rem;
  margin-left: 0.5rem;
  @include button-common;
}

.c-add-more {
  display: flex;
  justify-content: flex-end;
}

button.c-add-more-btn {
  display: inline-flex;
  align-items: center;
  font-size: $size_6;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  @include button-common;

  > i {
    position: relative;
    display: inline-block;
    font-size: 1.25em;
    margin-right: 0.15rem;
    transform: translateY(2px);
  }
}
</style>
`] }, media: void 0 });
};
var __vue_scope_id__ = "data-v-44b56f70";
var __vue_module_identifier__ = void 0;
var __vue_is_functional_template__ = false;
function __vue_normalize__(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang='pug'>
.c-payment-methods-container
  .c-entry(
    v-for='item in ephemeral.paymentMethods'
    :key='item.id'
  )
    .inputgroup.c-method-group
      Dropdown.c-method-dropdown(
        :defaultText='L("Choose...")'
        :options='config.methodOptions'
        :isOverlayStyle='true'
        @select='$event => onDropdownSelect(item.id, $event)'
      )
      input.input.no-label.c-method-input(type='text' v-model='item.detail')

    button.is-icon.c-delete-entry-btn(
      v-if='ephemeral.paymentMethods.length > 1'
      @click='deleteEntry(item.id)'
    )
      i.icon-minus-circle

  .c-add-more
    button.is-unstyled.c-add-more-btn(v-if='showAddMore' type='button' @click='addEntry')
      i.icon-plus-circle
      i18n.is-inline-block Add more
</template>

<script>
import Dropdown from '../../../../../src/serve/dashboard/views/components/forms/Dropdown.vue'
import { cloneDeep } from 'npm:turtledash'

const genRandomId = () => Math.random().toString(20).slice(2)

export default {
  name: 'PaymentMethods',
  props: {
    methods: {
      type: Array,
      required: true
    }
  },
  components: {
    Dropdown
  },
  computed: {
    showAddMore () {
      return this.ephemeral.paymentMethods.length < this.config.methodOptions.length
    }
  },
  data () {
    return {
      config: {
        methodOptions: [
          { id: 'paypal', name: 'Paypal' },
          { id: 'bitcoin', name: 'Bitcoin' },
          { id: 'venmo', name: 'Venmo' }
        ]
      },
      ephemeral: {
        paymentMethods: [
          { id: genRandomId(), method: null, detail: '' }
        ]
      },
      syncDebounceId: null
    }
  },
  methods: {
    onDropdownSelect (targetId, selectedItem) {
      const found = this.ephemeral.paymentMethods.find(x => x.id === targetId)
      found.method = selectedItem

      this.$emit('update:methods', cloneDeep(this.ephemeral.paymentMethods))
    },
    addEntry () {
      this.ephemeral.paymentMethods.push({ id: genRandomId(), method: null, detail: '' })
    },
    deleteEntry (targetId) {
      const index = this.ephemeral.paymentMethods.findIndex(x => x.id === targetId)
      this.ephemeral.paymentMethods.splice(index, 1)
    },
    debouncedMethodsSync () {
      if (this.syncDebounceId) {
        clearTimeout(this.syncDebounceId)
      }

      this.syncDebounceId = setTimeout(() => {
        this.$emit('update:methods', cloneDeep(this.ephemeral.paymentMethods))
      }, 800)
    }
  },
  updated () {
    this.debouncedMethodsSync()
  }
}
<\/script>

<style lang='scss' scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

@mixin button-common {
  border: 1px solid rgba(0, 0, 0, 0);
  background-color: $background_active;
  transition:
    box-shadow 200ms,
    border-color 120ms;

  &:hover,
  &:focus {
    border-color: $border;
    box-shadow: 0 0 4px $background_active;
  }

  &:active {
    border-color: $text_1;
  }
}

.c-payment-methods-container {
  position: relative;
}

.c-entry {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.inputgroup .c-method-input {
  height: 2.5rem;
  border-radius: 0 0.5rem 0.5rem 0;
  border: 1px solid $text_1;
}

.c-method-dropdown {
  ::v-deep .c-dropdown-trigger {
    border-radius: 0.5rem 0 0 0.5rem;

    &:hover {
      box-shadow: none;
    }
  }
}

.c-delete-entry-btn {
  flex-shrink: 0;
  border-radius: 50%;
  width: 2.25rem;
  height: 2.25rem;
  margin-left: 0.5rem;
  @include button-common;
}

.c-add-more {
  display: flex;
  justify-content: flex-end;
}

button.c-add-more-btn {
  display: inline-flex;
  align-items: center;
  font-size: $size_6;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  @include button-common;

  > i {
    position: relative;
    display: inline-block;
    font-size: 1.25em;
    margin-right: 0.15rem;
    transform: translateY(2px);
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
var PaymentMethods_default = __vue_component__;

// src/serve/dashboard/views/pages/Billing.vue
var validatePaymentMethods = (val) => Array.isArray(val) && val.length >= 1 && val.some((entry) => Boolean(entry.method && entry.detail));
var __vue_script__2 = {
  name: "Billing",
  mixins: [validationMixin_default],
  components: {
    PageTemplate: PageTemplate_default,
    PaymentMethods: PaymentMethods_default
  },
  data() {
    return {
      form: {
        paymentMethods: [],
        chargePerCredit: "",
        creditPerGiga: "",
        days: ""
      }
    };
  },
  methods: {
    onCancelClick() {
      this.$router.push({ path: "/main" });
    },
    onSaveClick() {
      this.$v.$touch();
      if (!this.$v.$error) {
        alert("TODO: implement submission.");
      }
    },
    onPayMethodChange() {
      this.$v.form.paymentMethods.$reset();
    }
  },
  validations: {
    form: {
      paymentMethods: { [L("At least one payment method has to be specified")]: validatePaymentMethods },
      chargePerCredit: { [L("This field is required")]: required },
      creditPerGiga: { [L("This field is required")]: required },
      days: { [L("This field is required")]: required }
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
            return [_vm._v(_vm._s(_vm.L("Billing")))];
          },
          proxy: true
        }
      ])
    },
    [
      _c("section", { staticClass: "c-section is-centered-on-mobile" }, [
        _c(
          "form",
          {
            staticClass: "c-form",
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
                  "i18n",
                  { staticClass: "label mb-0", attrs: { tag: "label" } },
                  [_vm._v("Accepted payment methods")]
                ),
                _c("i18n", { staticClass: "helper c-helper" }, [
                  _vm._v(
                    "What payment methods you will accept from your users."
                  )
                ]),
                _c("PaymentMethods", {
                  directives: [
                    {
                      name: "error",
                      rawName: "v-error:paymentMethods",
                      arg: "paymentMethods"
                    }
                  ],
                  staticClass: "c-payment-methods",
                  class: { "is-error": _vm.$v.form.paymentMethods.$error },
                  attrs: { methods: _vm.form.paymentMethods },
                  on: {
                    "update:methods": [
                      function($event) {
                        return _vm.$set(_vm.form, "paymentMethods", $event);
                      },
                      _vm.onPayMethodChange
                    ]
                  }
                })
              ],
              1
            ),
            _c(
              "label",
              { staticClass: "field" },
              [
                _c("i18n", { staticClass: "label" }, [
                  _vm._v("How much will you charge for credits?")
                ]),
                _c(
                  "div",
                  {
                    directives: [
                      {
                        name: "error",
                        rawName: "v-error:chargePerCredit",
                        arg: "chargePerCredit"
                      }
                    ],
                    staticClass: "inputgroup c-charge-per-credit",
                    class: { "is-error": _vm.$v.form.chargePerCredit.$error }
                  },
                  [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.form.chargePerCredit,
                          expression: "form.chargePerCredit"
                        }
                      ],
                      staticClass: "input no-label",
                      attrs: { type: "text" },
                      domProps: { value: _vm.form.chargePerCredit },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return;
                          }
                          _vm.$set(
                            _vm.form,
                            "chargePerCredit",
                            $event.target.value
                          );
                        }
                      }
                    }),
                    _c("i18n", { staticClass: "c-input-suffix" }, [
                      _vm._v("$ USD per Credit")
                    ])
                  ],
                  1
                )
              ],
              1
            ),
            _c(
              "label",
              { staticClass: "field" },
              [
                _c("i18n", { staticClass: "label" }, [
                  _vm._v(
                    "How many credits will you charge for Gigabyte per month?"
                  )
                ]),
                _c(
                  "div",
                  {
                    directives: [
                      {
                        name: "error",
                        rawName: "v-error:creditPerGiga",
                        arg: "creditPerGiga"
                      }
                    ],
                    staticClass: "inputgroup c-credit-per-gb",
                    class: { "is-error": _vm.$v.form.creditPerGiga.$error }
                  },
                  [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.form.creditPerGiga,
                          expression: "form.creditPerGiga"
                        }
                      ],
                      staticClass: "input no-label",
                      attrs: { type: "text" },
                      domProps: { value: _vm.form.creditPerGiga },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return;
                          }
                          _vm.$set(
                            _vm.form,
                            "creditPerGiga",
                            $event.target.value
                          );
                        }
                      }
                    }),
                    _c("i18n", { staticClass: "c-input-suffix" }, [
                      _vm._v("Credits per Gb")
                    ])
                  ],
                  1
                )
              ],
              1
            ),
            _c(
              "label",
              { staticClass: "field" },
              [
                _c("i18n", { staticClass: "label" }, [
                  _vm._v(
                    "How many days until data is deleted after credits run out?"
                  )
                ]),
                _c(
                  "div",
                  {
                    directives: [
                      { name: "error", rawName: "v-error:days", arg: "days" }
                    ],
                    staticClass: "inputgroup c-days-for-deletion",
                    class: { "is-error": _vm.$v.form.days.$error }
                  },
                  [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.form.days,
                          expression: "form.days"
                        }
                      ],
                      staticClass: "input no-label",
                      attrs: { type: "text" },
                      domProps: { value: _vm.form.days },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return;
                          }
                          _vm.$set(_vm.form, "days", $event.target.value);
                        }
                      }
                    }),
                    _c("i18n", { staticClass: "c-input-suffix" }, [
                      _vm._v("Days")
                    ])
                  ],
                  1
                )
              ],
              1
            ),
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
                  [_vm._v("cancel")]
                ),
                _c(
                  "i18n",
                  { attrs: { tag: "button" }, on: { click: _vm.onSaveClick } },
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
  inject("data-v-0f0d6c40_0", { source: "/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n[data-v-0f0d6c40]:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n:root[data-theme=dark][data-v-0f0d6c40] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n.c-page-header[data-v-0f0d6c40] {\n  margin-top: 2rem;\n  margin-bottom: 4.5rem;\n}\n.c-helper[data-v-0f0d6c40] {\n  margin-top: 0;\n  margin-bottom: 1rem;\n  font-size: 0.825rem;\n}\n.c-input-suffix[data-v-0f0d6c40] {\n  position: absolute;\n  display: inline-flex;\n  align-items: center;\n  top: 50%;\n  right: 0;\n  transform: translateY(-50%);\n  color: var(--text_1);\n  font-size: 0.875rem;\n  font-weight: 600;\n  height: 100%;\n  width: max-content;\n  padding: 0 0.75rem;\n  border-left: 1px solid var(--styled-input-border-color);\n  transition: border-color 150ms, color 150ms;\n  user-select: none;\n}\n.input:focus + .c-input-suffix[data-v-0f0d6c40] {\n  border-left-color: var(--text_0);\n  color: var(--text_0);\n}\n.c-charge-per-credit .input[data-v-0f0d6c40] {\n  padding-right: 9.5rem;\n}\n.c-credit-per-gb .input[data-v-0f0d6c40] {\n  padding-right: 8.25rem;\n}\n.c-days-for-deletion .input[data-v-0f0d6c40] {\n  padding-right: 4.25rem;\n}\n.c-btn-container[data-v-0f0d6c40] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 2.5rem;\n  padding: 0 0.5rem;\n}\n\n/*# sourceMappingURL=Billing.vue.map */", map: { "version": 3, "sources": ["Billing.vue", "src/serve/dashboard/views/pages/Billing.vue"], "names": [], "mappings": "AAAA,sEAAsE;AACtE,sBAAsB;AC6GtB,qBAAA;AD3GA;ECkHA,kCAAA;EAAA,iCAAA;EAAA,2CAAA;EAAA,iDAAA;EAAA,oCAAA;EAAA,sDAAA;EAAA,+CAAA;EAAA,qDAAA;EAAA,qCAAA;EAAA,4DAAA;EAAA,sDAAA;EAAA,mCAAA;EAAA,8CAAA;EAAA,0CAAA;EAAA,+BAAA;EAAA,gDAAA;EAAA,sDAAA;EAAA,4CAAA;EAAA,wCAAA;EAAA,iCAAA;EAAA,4BAAA;EAAA,mCAAA;EAAA,wDAAA;EAAA,6BAAA;EAAA,8BAAA;EAAA,gCAAA;EAAA,6CAAA;EAAA,sBAAA;EAAA,qCAAA;EAAA,0BAAA;EAAA,kCAAA;EAAA,6CAAA;EAAA,mCAAA;EAAA,qCAAA;EAAA,uCAAA;EAAA,+DAAA;EAAA,2CAAA;EAAA,0BAAA;EAAA,2HAAA;EAAA,qCAAA;EAAA,iBAAA;EAAA,+BAAA;ADvEA;AC4EA;EAIA,kCAAA;EAAA,oCAAA;EAAA,2CAAA;EAAA,8CAAA;EAAA,iCAAA;EAAA,uDAAA;EAAA,4CAAA;EAAA,kDAAA;EAAA,wCAAA;EAAA,iDAAA;EAAA,4DAAA;EAAA,mCAAA;EAAA,sDAAA;EAAA,0CAAA;EAAA,+BAAA;EAAA,6CAAA;EAAA,mDAAA;EAAA,iCAAA;EAAA,wCAAA;EAAA,iCAAA;EAAA,4BAAA;EAAA,mCAAA;EAAA,+CAAA;EAAA,gCAAA;EAAA,8BAAA;EAAA,gCAAA;EAAA,0CAAA;EAAA,yBAAA;EAAA,yCAAA;EAAA,+CAAA;EAAA,kCAAA;EAAA,+BAAA;EAAA,mCAAA;EAAA,qCAAA;EAAA,uCAAA;EAAA,mDAAA;EAAA,8CAAA;EAAA,6BAAA;EAAA,sIAAA;EAAA,0BAAA;EAAA,iBAAA;EAAA,uCAAA;ADnCA;ACkBA;EACA,gBAAA;EACA,qBAAA;ADfA;ACkBA;EACA,aAAA;EACA,mBAAA;EACA,mBAAA;ADfA;ACkBA;EACA,kBAAA;EACA,oBAAA;EACA,mBAAA;EACA,QAAA;EACA,QAAA;EACA,2BAAA;EACA,oBAAA;EACA,mBAAA;EACA,gBAAA;EACA,YAAA;EACA,kBAAA;EACA,kBAAA;EACA,uDAAA;EACA,2CAAA;EACA,iBAAA;ADfA;ACiBA;EACA,gCAAA;EACA,oBAAA;ADfA;ACmBA;EACA,qBAAA;ADhBA;ACmBA;EACA,sBAAA;ADhBA;ACmBA;EACA,sBAAA;ADhBA;ACmBA;EACA,aAAA;EACA,8BAAA;EACA,mBAAA;EACA,kBAAA;EACA,iBAAA;ADhBA;;AAEA,sCAAsC", "file": "Billing.vue", "sourcesContent": ["/* NOTE: <variable-name> : (<light-theme-value>, <dark-theme-value>) */\n/* stylelint-disable */\n/* stylelint-enable */\n:root {\n  --button-primary-bg-color: #1c1c1c;\n  --button-primary-text-color: #fff;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgba(0, 0, 0, 0.4);\n  --button-outline-text-color: #1c1c1c;\n  --button-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --styled-input-border-color: rgba(0, 0, 0, 0.1);\n  --styled-input-border-color_focus: rgba(0, 0, 0, 0.4);\n  --styled-input-background-color: #fff;\n  --styled-input-background-color_disabled: rgba(0, 0, 0, 0.1);\n  --styled-input-placeholder-color: rgba(0, 0, 0, 0.275);\n  --styled-input-label-color: #9747ff;\n  --radio-outer-border-color: rgba(0, 0, 0, 0.2);\n  --radio-outer-border-color_active: #1C1C1C;\n  --radio-inner-bg-color: #1C1C1C;\n  --toggle-switch-border-color: rgba(0, 0, 0, 0.1);\n  --toggle-switch-border-color_focus: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color: rgba(0, 0, 0, 0.4);\n  --toggle-switch-bg-color_active: #9747ff;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #FFFFFF;\n  --dropdown-active-bg-color: #F7F9FB;\n  --dropdown-box-shadow: 0 0 16px rgba(219, 219, 219, 0.5);\n  --summary-list-bg-color: #fff;\n  --custom-pre-bg-color: #f2f2f2;\n  --custom-pre-text-color: #1c1c1c;\n  --custom-pre-border-color: rgba(0, 0, 0, 0.1);\n  --modal-bg-color: #fff;\n  --stat-card-icon-color: var(--text_1);\n  --info-card-bg-color: #fff;\n  --info-card-feature-color: #1c1c1c;\n  --info-card-content-color: rgba(0, 0, 0, 0.5);\n  --tooltip-trigger-bg-color: #f7f9fb;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #1c1c1c;\n  --tooltip-trigger-box-shadow_hover: 0 0 5px rgba(0, 0, 0, 0.35);\n  --tooltip-bg-color: rgba(28, 28, 28, 0.875);\n  --tooltip-text-color: #fff;\n  --skeleton-gradient: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 12%, rgba(60, 60, 60, 0.125) 25%, rgba(0, 0, 0, 0.05) 42%);\n  --pill-text-color: rgba(0, 0, 0, 0.5);\n  --helper: #9747FF;\n  --ds-menu-border-color: #E5ECF6;\n}\n\n:root[data-theme=dark] {\n  --button-primary-bg-color: #b1e3ff;\n  --button-primary-text-color: #1c1c1c;\n  --button-outline-bg-color: rgba(0, 0, 0, 0);\n  --button-outline-border-color: rgb(65, 65, 65);\n  --button-outline-text-color: #fff;\n  --button-box-shadow: 0 0 12px rgba(132, 132, 132, 0.35);\n  --styled-input-border-color: rgb(65, 65, 65);\n  --styled-input-border-color_focus: rgb(65, 65, 65);\n  --styled-input-background-color: #2a2a2a;\n  --styled-input-background-color_disabled: #1c1c1c;\n  --styled-input-placeholder-color: rgba(255, 255, 255, 0.325);\n  --styled-input-label-color: #b1e3ff;\n  --radio-outer-border-color: rgba(255, 255, 255, 0.275);\n  --radio-outer-border-color_active: #b1e3ff;\n  --radio-inner-bg-color: #b1e3ff;\n  --toggle-switch-border-color: rgb(65, 65, 65);\n  --toggle-switch-border-color_focus: rgb(65, 65, 65);\n  --toggle-switch-bg-color: #2a2a2a;\n  --toggle-switch-bg-color_active: #95A4FC;\n  --toggle-switch-thumb-color: #fff;\n  --dropdown-bg-color: #1c1c1c;\n  --dropdown-active-bg-color: #2a2a2a;\n  --dropdown-box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  --summary-list-bg-color: #2a2a2a;\n  --custom-pre-bg-color: #1c1c1c;\n  --custom-pre-text-color: #f2f2f2;\n  --custom-pre-border-color: rgb(65, 65, 65);\n  --modal-bg-color: #2a2a2a;\n  --stat-card-icon-color: var(--text_black);\n  --info-card-bg-color: rgba(255, 255, 255, 0.05);\n  --info-card-feature-color: #b1e3ff;\n  --info-card-content-color: #fff;\n  --tooltip-trigger-bg-color: #b1e3ff;\n  --tooltip-trigger-text-color: #1c1c1c;\n  --tooltip-trigger-border-color: #b1e3ff;\n  --tooltip-trigger-box-shadow_hover: 0 0 7px #b1e3ff;\n  --tooltip-bg-color: rgba(242, 244, 247, 0.925);\n  --tooltip-text-color: #1c1c1c;\n  --skeleton-gradient: linear-gradient(110deg, rgba(255, 255, 255, 0.1) 8%, rgba(255, 255, 255, 0.14) 29%, rgba(255, 255, 255, 0.1) 47%);\n  --pill-text-color: #1c1c1c;\n  --helper: #b1e3ff;\n  --ds-menu-border-color: rgb(65, 65, 65);\n}\n\n.c-page-header {\n  margin-top: 2rem;\n  margin-bottom: 4.5rem;\n}\n\n.c-helper {\n  margin-top: 0;\n  margin-bottom: 1rem;\n  font-size: 0.825rem;\n}\n\n.c-input-suffix {\n  position: absolute;\n  display: inline-flex;\n  align-items: center;\n  top: 50%;\n  right: 0;\n  transform: translateY(-50%);\n  color: var(--text_1);\n  font-size: 0.875rem;\n  font-weight: 600;\n  height: 100%;\n  width: max-content;\n  padding: 0 0.75rem;\n  border-left: 1px solid var(--styled-input-border-color);\n  transition: border-color 150ms, color 150ms;\n  user-select: none;\n}\n.input:focus + .c-input-suffix {\n  border-left-color: var(--text_0);\n  color: var(--text_0);\n}\n\n.c-charge-per-credit .input {\n  padding-right: 9.5rem;\n}\n\n.c-credit-per-gb .input {\n  padding-right: 8.25rem;\n}\n\n.c-days-for-deletion .input {\n  padding-right: 4.25rem;\n}\n\n.c-btn-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 2.5rem;\n  padding: 0 0.5rem;\n}\n\n/*# sourceMappingURL=Billing.vue.map */", `<template lang='pug'>
PageTemplate
  template(#title='') {{ L('Billing') }}

  section.c-section.is-centered-on-mobile
    form.c-form(@submit.prevent='')
      .field
        i18n.label.mb-0(tag='label') Accepted payment methods
        i18n.helper.c-helper What payment methods you will accept from your users.

        PaymentMethods.c-payment-methods(
          :methods.sync='form.paymentMethods'
          :class='{ "is-error": $v.form.paymentMethods.$error }'
          v-error:paymentMethods=''
          @update:methods='onPayMethodChange'
        )

      label.field
        i18n.label How much will you charge for credits?

        .inputgroup.c-charge-per-credit(
          v-error:chargePerCredit=''
          :class='{ "is-error": $v.form.chargePerCredit.$error }'
        )
          input.input.no-label(type='text' v-model='form.chargePerCredit')
          i18n.c-input-suffix $ USD per Credit

      label.field
        i18n.label How many credits will you charge for Gigabyte per month?

        .inputgroup.c-credit-per-gb(
          v-error:creditPerGiga=''
          :class='{ "is-error": $v.form.creditPerGiga.$error }'
        )
          input.input.no-label(type='text' v-model='form.creditPerGiga')
          i18n.c-input-suffix Credits per Gb

      label.field
        i18n.label How many days until data is deleted after credits run out?

        .inputgroup.c-days-for-deletion(
          v-error:days=''
          :class='{ "is-error": $v.form.days.$error }'
        )
          input.input.no-label(type='text' v-model='form.days')
          i18n.c-input-suffix Days

      .c-btn-container
        i18n.is-outlined(tag='button' @click='onCancelClick') cancel
        i18n(tag='button' @click='onSaveClick') Save
</template>

<script>
import L from '../../../../../src/serve/dashboard/common/translations.js'
import PageTemplate from './PageTemplate.vue'
import PaymentMethods from '../../../../../src/serve/dashboard/views/components/PaymentMethods.vue'
import validationMixin from '../../../../../src/serve/dashboard/views/utils/validationMixin.js'
import { required } from '../../../../../src/serve/dashboard/views/utils/validators'

const validatePaymentMethods = val => Array.isArray(val) &&
  val.length >= 1 &&
  val.some(entry => Boolean(entry.method && entry.detail))

export default {
  name: 'Billing',
  mixins: [validationMixin],
  components: {
    PageTemplate,
    PaymentMethods
  },
  data () {
    return {
      form: {
        paymentMethods: [],
        chargePerCredit: '',
        creditPerGiga: '',
        days: ''
      }
    }
  },
  methods: {
    onCancelClick () {
      this.$router.push({ path: '/main' })
    },
    onSaveClick () {
      this.$v.$touch()

      if (!this.$v.$error) {
        alert('TODO: implement submission.')
      }
    },
    onPayMethodChange () {
      this.$v.form.paymentMethods.$reset()
    }
  },
  validations: {
    form: {
      paymentMethods: { [L('At least one payment method has to be specified')]: validatePaymentMethods },
      chargePerCredit: { [L('This field is required')]: required },
      creditPerGiga: { [L('This field is required')]: required },
      days: { [L('This field is required')]: required }
    }
  }
}
<\/script>

<style lang='scss' scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-page-header {
  margin-top: 2rem;
  margin-bottom: 4.5rem;
}

.c-helper {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 0.825rem;
}

.c-input-suffix {
  position: absolute;
  display: inline-flex;
  align-items: center;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  color: $text_1;
  font-size: $size_5;
  font-weight: 600;
  height: 100%;
  width: max-content;
  padding: 0 0.75rem;
  border-left: 1px solid var(--styled-input-border-color);
  transition: border-color 150ms, color 150ms;
  user-select: none;

  .input:focus + & {
    border-left-color: $text_0;
    color: $text_0;
  }
}

.c-charge-per-credit .input {
  padding-right: 9.5rem;
}

.c-credit-per-gb .input {
  padding-right: 8.25rem;
}

.c-days-for-deletion .input {
  padding-right: 4.25rem;
}

.c-btn-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5rem;
  padding: 0 0.5rem;
}
</style>
`] }, media: void 0 });
};
var __vue_scope_id__2 = "data-v-0f0d6c40";
var __vue_module_identifier__2 = void 0;
var __vue_is_functional_template__2 = false;
function __vue_normalize__2(template, style, script, scope, functional, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const component = (typeof script === "function" ? script.options : script) || {};
  component.__file = `<template lang='pug'>
PageTemplate
  template(#title='') {{ L('Billing') }}

  section.c-section.is-centered-on-mobile
    form.c-form(@submit.prevent='')
      .field
        i18n.label.mb-0(tag='label') Accepted payment methods
        i18n.helper.c-helper What payment methods you will accept from your users.

        PaymentMethods.c-payment-methods(
          :methods.sync='form.paymentMethods'
          :class='{ "is-error": $v.form.paymentMethods.$error }'
          v-error:paymentMethods=''
          @update:methods='onPayMethodChange'
        )

      label.field
        i18n.label How much will you charge for credits?

        .inputgroup.c-charge-per-credit(
          v-error:chargePerCredit=''
          :class='{ "is-error": $v.form.chargePerCredit.$error }'
        )
          input.input.no-label(type='text' v-model='form.chargePerCredit')
          i18n.c-input-suffix $ USD per Credit

      label.field
        i18n.label How many credits will you charge for Gigabyte per month?

        .inputgroup.c-credit-per-gb(
          v-error:creditPerGiga=''
          :class='{ "is-error": $v.form.creditPerGiga.$error }'
        )
          input.input.no-label(type='text' v-model='form.creditPerGiga')
          i18n.c-input-suffix Credits per Gb

      label.field
        i18n.label How many days until data is deleted after credits run out?

        .inputgroup.c-days-for-deletion(
          v-error:days=''
          :class='{ "is-error": $v.form.days.$error }'
        )
          input.input.no-label(type='text' v-model='form.days')
          i18n.c-input-suffix Days

      .c-btn-container
        i18n.is-outlined(tag='button' @click='onCancelClick') cancel
        i18n(tag='button' @click='onSaveClick') Save
</template>

<script>
import L from '../../../../../src/serve/dashboard/common/translations.js'
import PageTemplate from './PageTemplate.vue'
import PaymentMethods from '../../../../../src/serve/dashboard/views/components/PaymentMethods.vue'
import validationMixin from '../../../../../src/serve/dashboard/views/utils/validationMixin.js'
import { required } from '../../../../../src/serve/dashboard/views/utils/validators'

const validatePaymentMethods = val => Array.isArray(val) &&
  val.length >= 1 &&
  val.some(entry => Boolean(entry.method && entry.detail))

export default {
  name: 'Billing',
  mixins: [validationMixin],
  components: {
    PageTemplate,
    PaymentMethods
  },
  data () {
    return {
      form: {
        paymentMethods: [],
        chargePerCredit: '',
        creditPerGiga: '',
        days: ''
      }
    }
  },
  methods: {
    onCancelClick () {
      this.$router.push({ path: '/main' })
    },
    onSaveClick () {
      this.$v.$touch()

      if (!this.$v.$error) {
        alert('TODO: implement submission.')
      }
    },
    onPayMethodChange () {
      this.$v.form.paymentMethods.$reset()
    }
  },
  validations: {
    form: {
      paymentMethods: { [L('At least one payment method has to be specified')]: validatePaymentMethods },
      chargePerCredit: { [L('This field is required')]: required },
      creditPerGiga: { [L('This field is required')]: required },
      days: { [L('This field is required')]: required }
    }
  }
}
<\/script>

<style lang='scss' scoped>
@use "../../../../../src/serve/dashboard/assets/style/_variables.scss" as *;

.c-page-header {
  margin-top: 2rem;
  margin-bottom: 4.5rem;
}

.c-helper {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 0.825rem;
}

.c-input-suffix {
  position: absolute;
  display: inline-flex;
  align-items: center;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  color: $text_1;
  font-size: $size_5;
  font-weight: 600;
  height: 100%;
  width: max-content;
  padding: 0 0.75rem;
  border-left: 1px solid var(--styled-input-border-color);
  transition: border-color 150ms, color 150ms;
  user-select: none;

  .input:focus + & {
    border-left-color: $text_0;
    color: $text_0;
  }
}

.c-charge-per-credit .input {
  padding-right: 9.5rem;
}

.c-credit-per-gb .input {
  padding-right: 8.25rem;
}

.c-days-for-deletion .input {
  padding-right: 4.25rem;
}

.c-btn-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5rem;
  padding: 0 0.5rem;
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
var Billing_default = __vue_component__2;
export {
  Billing_default as default
};
