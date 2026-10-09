import {
  NoPasswordError
} from "./chunk-LFSZ3O36.js";
import {
  L
} from "./chunk-ZI2WDK4P.js";
import {
  esm_default
} from "./chunk-UHFMZPCY.js";

// src/serve/dashboard/views/utils/liveData.ts
var liveData_default = (path) => ({
  data() {
    return { live: { data: null, error: "" } };
  },
  async created() {
    try {
      this.live.data = await esm_default("backend/dashboard/get", path);
    } catch (e) {
      if (e instanceof NoPasswordError) {
        this.live.error = L("The dashboard shows no data until it has a password. Set dashboardAdminPassword under [server] in chel.toml, then restart chel.");
        return;
      }
      console.error(`[dashboard] could not load /api/${path}`, e);
      this.live.error = L("Could not load the data. The browser console has the details.");
    }
  }
});

// src/serve/dashboard/views/utils/format.ts
var humanBytes = (bytes) => {
  const units = ["B", "KiB", "MiB", "GiB", "TiB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return unit === 0 ? `${value} B` : `${value.toFixed(1)} ${units[unit]}`;
};
var credits = (picocredits) => (Number(picocredits) / 1e12).toFixed(2);

export {
  liveData_default,
  humanBytes,
  credits
};
