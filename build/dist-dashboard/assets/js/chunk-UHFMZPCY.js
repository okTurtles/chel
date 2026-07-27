var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/.deno/@sbp+sbp@2.4.1/node_modules/@sbp/sbp/dist/esm/index.js
var selectors = /* @__PURE__ */ Object.create(null);
var domains = /* @__PURE__ */ Object.create(null);
var globalFilters = [];
var domainFilters = /* @__PURE__ */ Object.create(null);
var selectorFilters = /* @__PURE__ */ Object.create(null);
var unsafeSelectors = /* @__PURE__ */ Object.create(null);
var DOMAIN_REGEX = /^[^/]+/;
function sbp(selector, ...data) {
  const domain = domainFromSelector(selector);
  const starSelector = `${domain}/*`;
  const selExists = !!selectors[selector];
  let sel = selector;
  if (!selExists) {
    if (selectors[starSelector]) {
      sel = starSelector;
    } else {
      throw new Error(`SBP: selector not registered: ${selector}`);
    }
  }
  for (const filters of [selectorFilters[selector], domainFilters[domain], globalFilters]) {
    if (filters) {
      for (const filter of filters) {
        if (filter(domain, selector, data) === false)
          return;
      }
    }
  }
  if (!selExists) {
    data.unshift(selector);
  }
  return selectors[sel].apply(domains[domain].state, data);
}
function domainFromSelector(selector) {
  const domainLookup = DOMAIN_REGEX.exec(selector);
  if (domainLookup === null) {
    throw new Error(`SBP: selector missing domain: ${selector}`);
  }
  return domainLookup[0];
}
var SBP_BASE_SELECTORS = {
  "sbp/selectors/register": (sels) => {
    const registered = [];
    for (const selector in sels) {
      const domainName = domainFromSelector(selector);
      const domain = domainName in domains ? domains[domainName] : domains[domainName] = { state: /* @__PURE__ */ Object.create(null), locked: false };
      if (domain.locked) {
        (console.warn || console.log)(`[SBP WARN]: not registering selector on locked domain: '${selector}'`);
      } else if (selectors[selector]) {
        (console.warn || console.log)(`[SBP WARN]: not registering already registered selector: '${selector}'`);
      } else if (typeof sels[selector] === "function") {
        if (unsafeSelectors[selector]) {
          (console.warn || console.log)(`[SBP WARN]: registering unsafe selector: '${selector}' (remember to lock after overwriting)`);
        }
        const fn = selectors[selector] = sels[selector];
        registered.push(selector);
        if (selector === `${domainName}/_init`) {
          fn.call(domain.state);
        }
      }
    }
    return registered;
  },
  "sbp/selectors/unregister": (sels) => {
    var _a;
    for (const selector of sels) {
      if (!unsafeSelectors[selector]) {
        throw new Error(`SBP: can't unregister locked selector: ${selector}`);
      }
      if ((_a = domains[domainFromSelector(selector)]) === null || _a === void 0 ? void 0 : _a.locked) {
        throw new Error(`SBP: can't unregister selector on a locked domain: '${selector}'`);
      }
      delete selectors[selector];
    }
  },
  "sbp/selectors/overwrite": (sels) => {
    sbp("sbp/selectors/unregister", Object.keys(sels));
    return sbp("sbp/selectors/register", sels);
  },
  "sbp/selectors/unsafe": (sels) => {
    for (const selector of sels) {
      if (selectors[selector]) {
        throw new Error("unsafe must be called before registering selector");
      }
      unsafeSelectors[selector] = true;
    }
  },
  "sbp/selectors/lock": (sels) => {
    for (const selector of sels) {
      delete unsafeSelectors[selector];
    }
  },
  "sbp/selectors/fn": (sel) => {
    return selectors[sel];
  },
  "sbp/filters/global/add": (filter) => {
    globalFilters.push(filter);
  },
  "sbp/filters/domain/add": (domain, filter) => {
    if (!domainFilters[domain])
      domainFilters[domain] = [];
    domainFilters[domain].push(filter);
  },
  "sbp/filters/selector/add": (selector, filter) => {
    if (!selectorFilters[selector])
      selectorFilters[selector] = [];
    selectorFilters[selector].push(filter);
  },
  "sbp/domains/lock": (domainNames) => {
    if (!domainNames) {
      for (const name in domains) {
        domains[name].locked = true;
      }
    } else {
      for (const name of domainNames) {
        if (!domains[name]) {
          throw new Error(`SBP: cannot lock non-existent domain: ${name}`);
        }
        domains[name].locked = true;
      }
    }
  }
};
SBP_BASE_SELECTORS["sbp/selectors/register"](SBP_BASE_SELECTORS);
var esm_default = sbp;

export {
  __commonJS,
  __export,
  __toESM,
  __publicField,
  esm_default
};
