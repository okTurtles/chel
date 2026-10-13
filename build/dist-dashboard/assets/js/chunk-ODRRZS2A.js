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
var PICOCREDITS_PER_CREDIT = 1000000000000n;
var PICOCREDITS_PER_CENT = PICOCREDITS_PER_CREDIT / 100n;
var credits = (picocredits) => {
  const balance = BigInt(picocredits);
  const abs = balance < 0n ? -balance : balance;
  const whole = abs / PICOCREDITS_PER_CREDIT;
  const cents = abs % PICOCREDITS_PER_CREDIT / PICOCREDITS_PER_CENT;
  const shown = `${whole}.${String(cents).padStart(2, "0")}`;
  return balance < 0n && shown !== "0.00" ? `-${shown}` : shown;
};

export {
  liveData_default,
  humanBytes,
  credits
};
