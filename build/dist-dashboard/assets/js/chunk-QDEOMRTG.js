import {
  debounce
} from "./chunk-ZI2WDK4P.js";
import {
  __commonJS,
  __toESM
} from "./chunk-UHFMZPCY.js";

// node_modules/.deno/vuelidate@0.7.6/node_modules/vuelidate/lib/vval.js
var require_vval = __commonJS({
  "node_modules/.deno/vuelidate@0.7.6/node_modules/vuelidate/lib/vval.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.patchChildren = patchChildren;
    exports.h = h;
    function isUndef(v) {
      return v === null || v === void 0;
    }
    function isDef(v) {
      return v !== null && v !== void 0;
    }
    function sameVval(oldVval, vval) {
      return vval.tag === oldVval.tag && vval.key === oldVval.key;
    }
    function createVm(vval) {
      var Vm = vval.tag;
      vval.vm = new Vm({
        data: vval.args
      });
    }
    function updateVval(vval) {
      var keys = Object.keys(vval.args);
      for (var i = 0; i < keys.length; i++) {
        keys.forEach(function(k) {
          vval.vm[k] = vval.args[k];
        });
      }
    }
    function createKeyToOldIdx(children, beginIdx, endIdx) {
      var i, key;
      var map = {};
      for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (isDef(key)) map[key] = i;
      }
      return map;
    }
    function updateChildren(oldCh, newCh) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVval = oldCh[0];
      var oldEndVval = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVval = newCh[0];
      var newEndVval = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, elmToMove;
      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVval)) {
          oldStartVval = oldCh[++oldStartIdx];
        } else if (isUndef(oldEndVval)) {
          oldEndVval = oldCh[--oldEndIdx];
        } else if (sameVval(oldStartVval, newStartVval)) {
          patchVval(oldStartVval, newStartVval);
          oldStartVval = oldCh[++oldStartIdx];
          newStartVval = newCh[++newStartIdx];
        } else if (sameVval(oldEndVval, newEndVval)) {
          patchVval(oldEndVval, newEndVval);
          oldEndVval = oldCh[--oldEndIdx];
          newEndVval = newCh[--newEndIdx];
        } else if (sameVval(oldStartVval, newEndVval)) {
          patchVval(oldStartVval, newEndVval);
          oldStartVval = oldCh[++oldStartIdx];
          newEndVval = newCh[--newEndIdx];
        } else if (sameVval(oldEndVval, newStartVval)) {
          patchVval(oldEndVval, newStartVval);
          oldEndVval = oldCh[--oldEndIdx];
          newStartVval = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
          idxInOld = isDef(newStartVval.key) ? oldKeyToIdx[newStartVval.key] : null;
          if (isUndef(idxInOld)) {
            createVm(newStartVval);
            newStartVval = newCh[++newStartIdx];
          } else {
            elmToMove = oldCh[idxInOld];
            if (sameVval(elmToMove, newStartVval)) {
              patchVval(elmToMove, newStartVval);
              oldCh[idxInOld] = void 0;
              newStartVval = newCh[++newStartIdx];
            } else {
              createVm(newStartVval);
              newStartVval = newCh[++newStartIdx];
            }
          }
        }
      }
      if (oldStartIdx > oldEndIdx) {
        addVvals(newCh, newStartIdx, newEndIdx);
      } else if (newStartIdx > newEndIdx) {
        removeVvals(oldCh, oldStartIdx, oldEndIdx);
      }
    }
    function addVvals(vvals, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        createVm(vvals[startIdx]);
      }
    }
    function removeVvals(vvals, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vvals[startIdx];
        if (isDef(ch)) {
          ch.vm.$destroy();
          ch.vm = null;
        }
      }
    }
    function patchVval(oldVval, vval) {
      if (oldVval === vval) {
        return;
      }
      vval.vm = oldVval.vm;
      updateVval(vval);
    }
    function patchChildren(oldCh, ch) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(oldCh, ch);
      } else if (isDef(ch)) {
        addVvals(ch, 0, ch.length - 1);
      } else if (isDef(oldCh)) {
        removeVvals(oldCh, 0, oldCh.length - 1);
      }
    }
    function h(tag, key, args) {
      return {
        tag,
        key,
        args
      };
    }
  }
});

// node_modules/.deno/vuelidate@0.7.6/node_modules/vuelidate/lib/params.js
var require_params = __commonJS({
  "node_modules/.deno/vuelidate@0.7.6/node_modules/vuelidate/lib/params.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.pushParams = pushParams;
    exports.popParams = popParams;
    exports.withParams = withParams;
    exports._setTarget = exports.target = void 0;
    function _objectSpread(target2) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
          ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
          }));
        }
        ownKeys.forEach(function(key) {
          _defineProperty(target2, key, source[key]);
        });
      }
      return target2;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _typeof(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    var stack = [];
    var target = null;
    exports.target = target;
    var _setTarget = function _setTarget2(x) {
      exports.target = target = x;
    };
    exports._setTarget = _setTarget;
    function pushParams() {
      if (target !== null) {
        stack.push(target);
      }
      exports.target = target = {};
    }
    function popParams() {
      var lastTarget = target;
      var newTarget = exports.target = target = stack.pop() || null;
      if (newTarget) {
        if (!Array.isArray(newTarget.$sub)) {
          newTarget.$sub = [];
        }
        newTarget.$sub.push(lastTarget);
      }
      return lastTarget;
    }
    function addParams(params) {
      if (_typeof(params) === "object" && !Array.isArray(params)) {
        exports.target = target = _objectSpread({}, target, params);
      } else {
        throw new Error("params must be an object");
      }
    }
    function withParamsDirect(params, validator) {
      return withParamsClosure(function(add) {
        return function() {
          add(params);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return validator.apply(this, args);
        };
      });
    }
    function withParamsClosure(closure) {
      var validator = closure(addParams);
      return function() {
        pushParams();
        try {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          return validator.apply(this, args);
        } finally {
          popParams();
        }
      };
    }
    function withParams(paramsOrClosure, maybeValidator) {
      if (_typeof(paramsOrClosure) === "object" && maybeValidator !== void 0) {
        return withParamsDirect(paramsOrClosure, maybeValidator);
      }
      return withParamsClosure(paramsOrClosure);
    }
  }
});

// node_modules/.deno/vuelidate@0.7.6/node_modules/vuelidate/lib/index.js
var require_lib = __commonJS({
  "node_modules/.deno/vuelidate@0.7.6/node_modules/vuelidate/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Vuelidate = Vuelidate;
    Object.defineProperty(exports, "withParams", {
      enumerable: true,
      get: function get() {
        return _params.withParams;
      }
    });
    exports.default = exports.validationMixin = void 0;
    var _vval = require_vval();
    var _params = require_params();
    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
    }
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance");
    }
    function _iterableToArray(iter) {
      if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
    }
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      }
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
          ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
          }));
        }
        ownKeys.forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _typeof(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    var NIL = function NIL2() {
      return null;
    };
    var buildFromKeys = function buildFromKeys2(keys, fn, keyFn) {
      return keys.reduce(function(build, key) {
        build[keyFn ? keyFn(key) : key] = fn(key);
        return build;
      }, {});
    };
    function isFunction(val) {
      return typeof val === "function";
    }
    function isObject(val) {
      return val !== null && (_typeof(val) === "object" || isFunction(val));
    }
    function isPromise(object) {
      return isObject(object) && isFunction(object.then);
    }
    var getPath = function getPath2(ctx, obj, path, fallback) {
      if (typeof path === "function") {
        return path.call(ctx, obj, fallback);
      }
      path = Array.isArray(path) ? path : path.split(".");
      for (var i = 0; i < path.length; i++) {
        if (obj && _typeof(obj) === "object") {
          obj = obj[path[i]];
        } else {
          return fallback;
        }
      }
      return typeof obj === "undefined" ? fallback : obj;
    };
    var __isVuelidateAsyncVm = "__isVuelidateAsyncVm";
    function makePendingAsyncVm(Vue, promise) {
      var asyncVm = new Vue({
        data: {
          p: true,
          v: false
        }
      });
      promise.then(function(value) {
        asyncVm.p = false;
        asyncVm.v = value;
      }, function(error) {
        asyncVm.p = false;
        asyncVm.v = false;
        throw error;
      });
      asyncVm[__isVuelidateAsyncVm] = true;
      return asyncVm;
    }
    var validationGetters = {
      $invalid: function $invalid() {
        var _this = this;
        var proxy = this.proxy;
        return this.nestedKeys.some(function(nested) {
          return _this.refProxy(nested).$invalid;
        }) || this.ruleKeys.some(function(rule) {
          return !proxy[rule];
        });
      },
      $dirty: function $dirty() {
        var _this2 = this;
        if (this.dirty) {
          return true;
        }
        if (this.nestedKeys.length === 0) {
          return false;
        }
        return this.nestedKeys.every(function(key) {
          return _this2.refProxy(key).$dirty;
        });
      },
      $anyDirty: function $anyDirty() {
        var _this3 = this;
        if (this.dirty) {
          return true;
        }
        if (this.nestedKeys.length === 0) {
          return false;
        }
        return this.nestedKeys.some(function(key) {
          return _this3.refProxy(key).$anyDirty;
        });
      },
      $error: function $error() {
        return this.$dirty && !this.$pending && this.$invalid;
      },
      $anyError: function $anyError() {
        var _this4 = this;
        if (this.$error) return true;
        return this.nestedKeys.some(function(key) {
          return _this4.refProxy(key).$anyError;
        });
      },
      $pending: function $pending() {
        var _this5 = this;
        return this.ruleKeys.some(function(key) {
          return _this5.getRef(key).$pending;
        }) || this.nestedKeys.some(function(key) {
          return _this5.refProxy(key).$pending;
        });
      },
      $params: function $params() {
        var _this6 = this;
        var vals = this.validations;
        return _objectSpread({}, buildFromKeys(this.nestedKeys, function(key) {
          return vals[key] && vals[key].$params || null;
        }), buildFromKeys(this.ruleKeys, function(key) {
          return _this6.getRef(key).$params;
        }));
      }
    };
    function setDirtyRecursive(newState) {
      this.dirty = newState;
      var proxy = this.proxy;
      var method = newState ? "$touch" : "$reset";
      this.nestedKeys.forEach(function(key) {
        proxy[key][method]();
      });
    }
    var validationMethods = {
      $touch: function $touch() {
        setDirtyRecursive.call(this, true);
      },
      $reset: function $reset() {
        setDirtyRecursive.call(this, false);
      },
      $flattenParams: function $flattenParams() {
        var proxy = this.proxy;
        var params = [];
        for (var key in this.$params) {
          if (this.isNested(key)) {
            var childParams = proxy[key].$flattenParams();
            for (var j = 0; j < childParams.length; j++) {
              childParams[j].path.unshift(key);
            }
            params = params.concat(childParams);
          } else {
            params.push({
              path: [],
              name: key,
              params: this.$params[key]
            });
          }
        }
        return params;
      }
    };
    var getterNames = Object.keys(validationGetters);
    var methodNames = Object.keys(validationMethods);
    var _cachedComponent = null;
    var getComponent = function getComponent2(Vue) {
      if (_cachedComponent) {
        return _cachedComponent;
      }
      var VBase = Vue.extend({
        computed: {
          refs: function refs() {
            var oldVval = this._vval;
            this._vval = this.children;
            (0, _vval.patchChildren)(oldVval, this._vval);
            var refs2 = {};
            this._vval.forEach(function(c) {
              refs2[c.key] = c.vm;
            });
            return refs2;
          }
        },
        beforeCreate: function beforeCreate() {
          this._vval = null;
        },
        beforeDestroy: function beforeDestroy() {
          if (this._vval) {
            (0, _vval.patchChildren)(this._vval);
            this._vval = null;
          }
        },
        methods: {
          getModel: function getModel() {
            return this.lazyModel ? this.lazyModel(this.prop) : this.model;
          },
          getModelKey: function getModelKey(key) {
            var model = this.getModel();
            if (model) {
              return model[key];
            }
          },
          hasIter: function hasIter() {
            return false;
          }
        }
      });
      var ValidationRule = VBase.extend({
        data: function data() {
          return {
            rule: null,
            lazyModel: null,
            model: null,
            lazyParentModel: null,
            rootModel: null
          };
        },
        methods: {
          runRule: function runRule(parent) {
            var model = this.getModel();
            (0, _params.pushParams)();
            var rawOutput = this.rule.call(this.rootModel, model, parent);
            var output = isPromise(rawOutput) ? makePendingAsyncVm(Vue, rawOutput) : rawOutput;
            var rawParams = (0, _params.popParams)();
            var params = rawParams && rawParams.$sub ? rawParams.$sub.length > 1 ? rawParams : rawParams.$sub[0] : null;
            return {
              output,
              params
            };
          }
        },
        computed: {
          run: function run() {
            var _this7 = this;
            var parent = this.lazyParentModel();
            var isArrayDependant = Array.isArray(parent) && parent.__ob__;
            if (isArrayDependant) {
              var arrayDep = parent.__ob__.dep;
              arrayDep.depend();
              var target = arrayDep.constructor.target;
              if (!this._indirectWatcher) {
                var Watcher = target.constructor;
                this._indirectWatcher = new Watcher(this, function() {
                  return _this7.runRule(parent);
                }, null, {
                  lazy: true
                });
              }
              var model = this.getModel();
              if (!this._indirectWatcher.dirty && this._lastModel === model) {
                this._indirectWatcher.depend();
                return target.value;
              }
              this._lastModel = model;
              this._indirectWatcher.evaluate();
              this._indirectWatcher.depend();
            } else if (this._indirectWatcher) {
              this._indirectWatcher.teardown();
              this._indirectWatcher = null;
            }
            return this._indirectWatcher ? this._indirectWatcher.value : this.runRule(parent);
          },
          $params: function $params() {
            return this.run.params;
          },
          proxy: function proxy() {
            var output = this.run.output;
            if (output[__isVuelidateAsyncVm]) {
              return !!output.v;
            }
            return !!output;
          },
          $pending: function $pending() {
            var output = this.run.output;
            if (output[__isVuelidateAsyncVm]) {
              return output.p;
            }
            return false;
          }
        },
        destroyed: function destroyed() {
          if (this._indirectWatcher) {
            this._indirectWatcher.teardown();
            this._indirectWatcher = null;
          }
        }
      });
      var Validation = VBase.extend({
        data: function data() {
          return {
            dirty: false,
            validations: null,
            lazyModel: null,
            model: null,
            prop: null,
            lazyParentModel: null,
            rootModel: null
          };
        },
        methods: _objectSpread({}, validationMethods, {
          refProxy: function refProxy(key) {
            return this.getRef(key).proxy;
          },
          getRef: function getRef(key) {
            return this.refs[key];
          },
          isNested: function isNested(key) {
            return typeof this.validations[key] !== "function";
          }
        }),
        computed: _objectSpread({}, validationGetters, {
          nestedKeys: function nestedKeys() {
            return this.keys.filter(this.isNested);
          },
          ruleKeys: function ruleKeys() {
            var _this8 = this;
            return this.keys.filter(function(k) {
              return !_this8.isNested(k);
            });
          },
          keys: function keys() {
            return Object.keys(this.validations).filter(function(k) {
              return k !== "$params";
            });
          },
          proxy: function proxy() {
            var _this9 = this;
            var keyDefs = buildFromKeys(this.keys, function(key) {
              return {
                enumerable: true,
                configurable: true,
                get: function get() {
                  return _this9.refProxy(key);
                }
              };
            });
            var getterDefs = buildFromKeys(getterNames, function(key) {
              return {
                enumerable: true,
                configurable: true,
                get: function get() {
                  return _this9[key];
                }
              };
            });
            var methodDefs = buildFromKeys(methodNames, function(key) {
              return {
                enumerable: false,
                configurable: true,
                get: function get() {
                  return _this9[key];
                }
              };
            });
            var iterDefs = this.hasIter() ? {
              $iter: {
                enumerable: true,
                value: Object.defineProperties({}, _objectSpread({}, keyDefs))
              }
            } : {};
            return Object.defineProperties({}, _objectSpread({}, keyDefs, iterDefs, {
              $model: {
                enumerable: true,
                get: function get() {
                  var parent = _this9.lazyParentModel();
                  if (parent != null) {
                    return parent[_this9.prop];
                  } else {
                    return null;
                  }
                },
                set: function set(value) {
                  var parent = _this9.lazyParentModel();
                  if (parent != null) {
                    parent[_this9.prop] = value;
                    _this9.$touch();
                  }
                }
              }
            }, getterDefs, methodDefs));
          },
          children: function children() {
            var _this10 = this;
            return _toConsumableArray(this.nestedKeys.map(function(key) {
              return renderNested(_this10, key);
            })).concat(_toConsumableArray(this.ruleKeys.map(function(key) {
              return renderRule(_this10, key);
            }))).filter(Boolean);
          }
        })
      });
      var GroupValidation = Validation.extend({
        methods: {
          isNested: function isNested(key) {
            return typeof this.validations[key]() !== "undefined";
          },
          getRef: function getRef(key) {
            var vm = this;
            return {
              get proxy() {
                return vm.validations[key]() || false;
              }
            };
          }
        }
      });
      var EachValidation = Validation.extend({
        computed: {
          keys: function keys() {
            var model = this.getModel();
            if (isObject(model)) {
              return Object.keys(model);
            } else {
              return [];
            }
          },
          tracker: function tracker() {
            var _this11 = this;
            var trackBy = this.validations.$trackBy;
            return trackBy ? function(key) {
              return "".concat(getPath(_this11.rootModel, _this11.getModelKey(key), trackBy));
            } : function(x) {
              return "".concat(x);
            };
          },
          getModelLazy: function getModelLazy() {
            var _this12 = this;
            return function() {
              return _this12.getModel();
            };
          },
          children: function children() {
            var _this13 = this;
            var def = this.validations;
            var model = this.getModel();
            var validations = _objectSpread({}, def);
            delete validations["$trackBy"];
            var usedTracks = {};
            return this.keys.map(function(key) {
              var track = _this13.tracker(key);
              if (usedTracks.hasOwnProperty(track)) {
                return null;
              }
              usedTracks[track] = true;
              return (0, _vval.h)(Validation, track, {
                validations,
                prop: key,
                lazyParentModel: _this13.getModelLazy,
                model: model[key],
                rootModel: _this13.rootModel
              });
            }).filter(Boolean);
          }
        },
        methods: {
          isNested: function isNested() {
            return true;
          },
          getRef: function getRef(key) {
            return this.refs[this.tracker(key)];
          },
          hasIter: function hasIter() {
            return true;
          }
        }
      });
      var renderNested = function renderNested2(vm, key) {
        if (key === "$each") {
          return (0, _vval.h)(EachValidation, key, {
            validations: vm.validations[key],
            lazyParentModel: vm.lazyParentModel,
            prop: key,
            lazyModel: vm.getModel,
            rootModel: vm.rootModel
          });
        }
        var validations = vm.validations[key];
        if (Array.isArray(validations)) {
          var root = vm.rootModel;
          var refVals = buildFromKeys(validations, function(path) {
            return function() {
              return getPath(root, root.$v, path);
            };
          }, function(v) {
            return Array.isArray(v) ? v.join(".") : v;
          });
          return (0, _vval.h)(GroupValidation, key, {
            validations: refVals,
            lazyParentModel: NIL,
            prop: key,
            lazyModel: NIL,
            rootModel: root
          });
        }
        return (0, _vval.h)(Validation, key, {
          validations,
          lazyParentModel: vm.getModel,
          prop: key,
          lazyModel: vm.getModelKey,
          rootModel: vm.rootModel
        });
      };
      var renderRule = function renderRule2(vm, key) {
        return (0, _vval.h)(ValidationRule, key, {
          rule: vm.validations[key],
          lazyParentModel: vm.lazyParentModel,
          lazyModel: vm.getModel,
          rootModel: vm.rootModel
        });
      };
      _cachedComponent = {
        VBase,
        Validation
      };
      return _cachedComponent;
    };
    var _cachedVue = null;
    function getVue(rootVm) {
      if (_cachedVue) return _cachedVue;
      var Vue = rootVm.constructor;
      while (Vue.super) {
        Vue = Vue.super;
      }
      _cachedVue = Vue;
      return Vue;
    }
    var validateModel = function validateModel2(model, validations) {
      var Vue = getVue(model);
      var _getComponent = getComponent(Vue), Validation = _getComponent.Validation, VBase = _getComponent.VBase;
      var root = new VBase({
        computed: {
          children: function children() {
            var vals = typeof validations === "function" ? validations.call(model) : validations;
            return [(0, _vval.h)(Validation, "$v", {
              validations: vals,
              lazyParentModel: NIL,
              prop: "$v",
              model,
              rootModel: model
            })];
          }
        }
      });
      return root;
    };
    var validationMixin = {
      data: function data() {
        var vals = this.$options.validations;
        if (vals) {
          this._vuelidate = validateModel(this, vals);
        }
        return {};
      },
      beforeCreate: function beforeCreate() {
        var options = this.$options;
        var vals = options.validations;
        if (!vals) return;
        if (!options.computed) options.computed = {};
        if (options.computed.$v) return;
        options.computed.$v = function() {
          return this._vuelidate ? this._vuelidate.refs.$v.proxy : null;
        };
      },
      beforeDestroy: function beforeDestroy() {
        if (this._vuelidate) {
          this._vuelidate.$destroy();
          this._vuelidate = null;
        }
      }
    };
    exports.validationMixin = validationMixin;
    function Vuelidate(Vue) {
      Vue.mixin(validationMixin);
    }
    var _default = Vuelidate;
    exports.default = _default;
  }
});

// src/serve/dashboard/views/utils/validationMixin.ts
var import_npm_vuelidate = __toESM(require_lib());
var validationMixin_default = {
  mixins: [import_npm_vuelidate.validationMixin],
  methods: {
    debounceField(fieldName, value) {
      this.$v.form[fieldName].$reset();
      this.debounceValidation(fieldName, value);
    },
    /**
     * Validate the field and update it immediately.
     * - Usually used on @blur.
     */
    updateField(fieldName, value) {
      if (value) {
        this.form[fieldName] = value;
      }
      this.$v.form[fieldName].$touch();
    },
    /**
     * Debounce field validations
     * - You can call it when you want to debounce expensive validations.
     */
    debounceValidation: debounce(function(fieldName, value) {
      this.updateField(fieldName, value);
    }, 800),
    // sometimes, validations for all fields need to be done all at once.
    // e.g) validate all fields at the same time when 'submit' is clicked.
    validateAll() {
      const validationKeys = Object.keys(this.form || {}).filter((key) => Boolean(this.$v.form[key]));
      for (const key of validationKeys) {
        this.$v.form[key].$touch();
      }
    }
  }
};

// src/serve/dashboard/views/utils/validators.ts
var required = (value) => {
  if (value === null || value === void 0) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export {
  validationMixin_default,
  required
};
