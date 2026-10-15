import {
  esm_default
} from "./chunk-UHFMZPCY.js";

// src/serve/dashboard/controller/backend.ts
var languageFileMap = /* @__PURE__ */ new Map([
  ["ko", "korean.json"]
]);
function handleFetchResult(type) {
  return function(r) {
    if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`);
    return r[type]();
  };
}
var NoPasswordError = class extends Error {
};
esm_default("sbp/selectors/register", {
  // With a password set, the browser already asked for it and sends it along
  async "backend/dashboard/get"(path) {
    const r = await fetch(`${esm_default("okTurtles.data/get", "API_URL")}/api/${path}`);
    if (r.status === 403) throw new NoPasswordError();
    return handleFetchResult("json")(r);
  },
  async "backend/translations/get"(language) {
    const [languageCode] = language.toLowerCase().split("-");
    const languageFileName = languageFileMap.get(languageCode) || "";
    if (languageFileName !== "") {
      return await fetch(`${esm_default("okTurtles.data/get", "API_URL")}/assets/strings/${languageFileName}`).then(handleFetchResult("json"));
    }
    return null;
  }
});

export {
  NoPasswordError
};
