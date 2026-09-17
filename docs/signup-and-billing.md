# Signup, registration, and billing

A new user registers by sending the first message of an "ownerless" contract
(an identity contract) to `POST /event`, unauthenticated. That message is
what turns the contract into a new *billable entity*: everything the entity
later creates (groups, chatrooms, files) is attributed to it and billed
together. Because such requests are unauthenticated, they are subject to the
extra checks below. Requests that are authenticated, or that belong to an
existing billable entity, skip them.

- **Request body limit.** Every `POST /event` body over 1 MiB (1048576 bytes)
  is rejected before any of the settings below are consulted, so they cannot
  be raised beyond it.
- **First-message size cap.** `server.signup.maxFirstMessageBytes` (default `5120`)
  bounds how much data a registration may write 'for free'; larger first
  messages are rejected with a `413`.
- **Kill switch.** `server.signup.disabled` (default `false`) rejects all new
  registrations with a `403` while existing users are unaffected.
- **Per-IP rate limits.** New registrations per IP address are limited by
  `server.signup.limit.minute`, `server.signup.limit.hour`, and
  `server.signup.limit.day` (defaults `2`/`10`/`50` per IP); exceeding them
  is answered with a `429`. These limits exist to slow down mass registration
  on a public server and would only get in the way locally, so they are
  enforced only when the server runs with `NODE_ENV=production`.
  `server.signup.limit.disabled` can turn them off there too (the server
  logs a warning at startup when the limits are inactive). IPv6 addresses
  are limited per `/64` subnet, their smallest possible allocation.

Once registered, storage is metered per billable entity: the identity
contract plus everything it owns. `server.billing.freeAllowanceBytes`
(default `10485760`, i.e. 10 MiB) of storage is free; `0` disables the free
tier. Storage beyond the allowance is charged by the credits worker, which
runs a billing cycle in the background and debits the entity's balance for
the bytes it keeps stored.
