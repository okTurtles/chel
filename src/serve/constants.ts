export const CREDITS_WORKER_TASK_TIME_INTERVAL = 300e3
export const OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL = 30e3

export const MEGABYTE = 1048576

// Hard ceiling on the size of a `POST /event` request body, enforced by
// middleware before the route handler runs (see `src/serve/routes.ts`).
// `server.signup.maxFirstMessageBytes` cannot usefully exceed it, so it is
// bounded by this value both when validating `chel.toml` (see
// `src/validateConfig.ts`) and when reading the setting at startup.
export const MAX_EVENT_BODY_BYTES = MEGABYTE

// A contract or file ID. Shared by the API and the dashboard so the two can't
// accept different IDs. Checked as safe from ReDoS with
// <https://devina.io/redos-checker>
export const CID_REGEX = /^z[1-9A-HJ-NP-Za-km-z]{8,72}$/
