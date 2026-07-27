// src/serve/dashboard/common/cdTimeUtils.ts
var MINS_MILLIS = 6e4;
var HOURS_MILLIS = 60 * MINS_MILLIS;
var DAYS_MILLIS = 24 * HOURS_MILLIS;
var MONTHS_MILLIS = 30 * DAYS_MILLIS;
function humanDate(date, options = { month: "short", day: "numeric" }) {
  const locale = typeof navigator === "undefined" ? "en-US" : navigator.language;
  return new Date(date).toLocaleDateString(locale, options);
}
function addTimeToDate(date, timeMillis) {
  const d = new Date(date);
  d.setTime(d.getTime() + timeMillis);
  return d;
}

export {
  MONTHS_MILLIS,
  humanDate,
  addTimeToDate
};
