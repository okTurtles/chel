# Running a server

`chel serve` is the whole server: it serves your built app, answers the API,
and runs the websocket that pushes updates to the clients. It also starts a
dashboard on a second port. Its options are in
[commands.md](commands.md#chel-serve).

## What it serves

- **The app**, at `/app/`: `index.html` from the app directory, and that
  directory's `assets/` folder at `/assets/`.
- **The API and the websocket**, on the same port, `8000` by default.
- **The dashboard**, on its own port, `8888` by default. See
  [the dashboard](#the-dashboard).

## What happens at startup

1. It checks that `server_id` is set, and refuses to start without it.
   `chel init` writes one.
2. It starts the dashboard.
3. It uploads every manifest in the manifests folder (`contracts/` by default,
   laid out as `contracts/<name>/<version>/`) to its database, together with
   the contract files they point to. With `--dev` it also keeps watching the
   folder, and uploads new versions as they appear. Without `--dev`, a new
   version needs a restart or a `chel deploy`.
4. It starts the app server.

```bash
# The app and its contracts in the current directory
chel serve

# Other ports
chel serve --port 8001 --dashboard-port 8889 ./my-app

# Development: also upload contract versions as they are pinned
chel serve --dev ./dist
```

## The dashboard

The dashboard shows the server's registered usernames, the contracts it
stores, how much space each account uses and each account's credits. It never
shows what is inside a contract, since that is encrypted. Because of the
usernames, it has two settings under `[server]` in `chel.toml`:

- `dashboardListenIP`: the address it listens on, `127.0.0.1` by default, so
  only this machine can open it.
- `dashboardAdminPassword`: until this is set, the dashboard shows no data.
  Once it is, the browser asks for it (any user name works). To keep it out of
  the file, set `server__dashboardAdminPassword` in the environment instead.
  The password travels with every request, so put the dashboard behind HTTPS
  before opening it to other machines.

## In production

```bash
NODE_ENV=production chel serve --app-manifest chelonia.json dist
```

- **`NODE_ENV=production`** turns on the signup limits per IP address (see
  [signup-and-billing.md](signup-and-billing.md)). Two routes for development
  are only there when `NODE_ENV` is exactly `development`: the one
  `chel deploy --url` and `chel upload --url` upload through, and one that
  prints logs sent by clients.
- **A database that persists.** The default backend, `mem`, loses every
  account when the server stops. See
  [configuration.md](configuration.md#database-backends).
- **`chelonia.json`.** `contracts/` is read from the current folder, and so is
  `chel.toml` unless `--config` says otherwise. But `chelonia.json` is read
  from the app folder, unless `--app-manifest` points somewhere else. `chel pin` writes it in the current folder, hence the
  flag when the app is in `dist/`. Without it, the server only logs a warning,
  and clients get no version information.
- **Behind a reverse proxy.** The proxy must set `X-Real-IP` and pass the
  websocket through, and clients must not reach chel directly. See
  [behind a reverse proxy](#behind-a-reverse-proxy).
- **Backups.** Every account is in the database, so back it up, together with
  `chel.toml` and its `server_id`.

## Behind a reverse proxy

chel takes each client's address from the `X-Real-IP` header, and from the
connection when there is none. The signup limits count by that address, and
some log lines show it. The limits never read `X-Forwarded-For`. So if the
proxy doesn't set `X-Real-IP`, every visitor has the proxy's address and they
all share one limit. And nginx passes on an `X-Real-IP` that a visitor sends,
so anyone could get around the limit.

For nginx on the same machine as chel:

```nginx
location / {
  proxy_pass http://127.0.0.1:8000;
  proxy_set_header Host $host;
  # Replaces any X-Real-IP the client sent
  proxy_set_header X-Real-IP $remote_addr;
  # The websocket
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
}
```

Then make sure nginx is the only way in, or anyone could send chel their own
`X-Real-IP` and get around the limits. Keep chel's port closed to the outside,
or set `host = "127.0.0.1"` under `[server]` in `chel.toml` so it only listens
on this machine.
