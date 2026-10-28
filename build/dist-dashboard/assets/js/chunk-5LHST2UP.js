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
var hasIntl = typeof Intl !== "undefined" && typeof Intl.NumberFormat === "function";
var humanBytes = (bytes, locale) => {
  const units = ["B", "KiB", "MiB", "GiB", "TiB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  const digits = unit === 0 ? 0 : 1;
  const number = hasIntl ? new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value) : value.toFixed(digits);
  return `${number} ${units[unit]}`;
};
var PICOCREDITS_PER_CREDIT = 1000000000000n;
var PICOCREDIT_DIGITS = 12;
var PICOCREDITS_PER_CENT = PICOCREDITS_PER_CREDIT / 100n;
var credits = (picocredits, locale) => {
  const balance = BigInt(picocredits);
  const abs = balance < 0n ? -balance : balance;
  const whole = abs / PICOCREDITS_PER_CREDIT;
  const fraction = abs % PICOCREDITS_PER_CREDIT;
  if (hasIntl) {
    const exact = `${balance < 0n ? "-" : ""}${whole}.${String(fraction).padStart(PICOCREDIT_DIGITS, "0")}`;
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        roundingMode: "trunc",
        signDisplay: "negative"
      }).format(exact);
    } catch {
    }
  }
  const shown = `${whole}.${String(fraction / PICOCREDITS_PER_CENT).padStart(2, "0")}`;
  return balance < 0n && shown !== "0.00" ? `-${shown}` : shown;
};

export {
  liveData_default,
  humanBytes,
  credits
};
