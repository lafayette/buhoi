# AGENTS.md

Guidance for AI agents working in this repository.

## Project

`buhoi` is an application server: an express web server with RPC over HTTP, a task server on top of
RabbitMQ, PostgreSQL through knex, optional redis caching and webpack dev middleware. A consuming
application passes a config (`buhoi.config.simple`) and buhoi discovers its features and tasks from
the filesystem. Everything else is driven by `BUHOI_*` environment variables.

## Branches

- `master` — main line, targets current Node.js (`engines.node >= 18`, CI on Node 24).
- `legacy` — maintenance line for **Node.js 8**. This is the branch you are on.

Keep the two branches feature-equivalent: when you change behaviour on one, port it to the other,
adapting only syntax, tooling and formatting.

## totlog

`totlog` is a sibling repository pinned by commit SHA (`github:lafayette/totlog#<sha>`), and its
branches are paired with these ones: buhoi `master` follows totlog `master`, buhoi `legacy` follows
totlog `legacy`. Never cross the pairing. To move a pin, edit `package.json` and run `npm install` so
the lockfile is regenerated — never hand-edit the `integrity` field.

## Layout

| Path | Purpose |
| --- | --- |
| `src/index.js` | public surface: `config`, `start`, `stop`, plus infra and result helpers via a Proxy |
| `src/config/` | `simple` and `backend-only` config builders, feature discovery |
| `src/infra/` | log (totlog), pg (knex), mq (mqu), cache (redis), webpack |
| `src/web-server/` | express app, transport (http/https), middleware, RPC host |
| `src/task-server/` | RabbitMQ job and event consumers, scheduled jobs |
| `src/client/` | browser-side RPC client and storage |
| `tests/` | mocha specs plus `tests/app`, a miniature application they run against |

## This branch: Node.js 8

- ES2017 at most: no object spread in source, no optional chaining, no nullish coalescing.
- The toolchain is pinned to old majors on purpose: ESLint 4 via `@titarenko/eslint-config`
  (`.eslintrc.js`), mocha 4, nyc 14, webpack 3, knex 0.15.
- Develop and test with Node 8 (`nvm use 8`), not with whatever Node is on `PATH`.
- `tests/mocha-hooks.js` uses mocha 4's global `before`/`after` and is simply picked up by the
  recursive run; `master` loads root hooks (`exports.mochaHooks`) with `--require` instead.

## Commands

Tests need redis and RabbitMQ running:

```bash
nvm use 8
npm install
npm run lint
NODE_ENV=development BUHOI_REDIS=redis://localhost BUHOI_MQ=amqp://guest:guest@localhost npm test
```

`npm test` runs the linter and then mocha. `tests/mocha-hooks.js` starts and stops a real buhoi
instance around the whole suite, so a spec that leaves a server or connection behind breaks
everything after it.

This branch has no CI. Its `.travis.yml` was removed: travis-ci.org has been shut down for years, so
the file described a pipeline that could never run, and `master`'s GitHub Actions workflow is scoped
to `master`. Run the linter and the suite locally before committing.

## Code style

Enforced by ESLint (`@titarenko/eslint-config`, which extends `standard`) — run the linter instead
of guessing.

- Two spaces for indentation, no semicolons, single quotes, trailing commas in multiline literals.
- Space before function parens: `function create (options) {`.
- `function` declarations for exported units, arrows for callbacks.

## Conventions

- Every environment variable is named `BUHOI_*`, read through `process.env` at the point of use, and
  documented in the README table. Adding one without a README row is incomplete work.
- Features are `index.js` files under `featuresPath`; an exported function is an RPC procedure. The
  markers `// @public` (no authorization) and `// @cache <human interval>` are parsed out of the
  function source, so do not reformat them away.
- Tasks are files under `<feature>/tasks/`; they export `handler` plus optionally `event`,
  `schedule`, `options` and `persistent`.
- The `schedule` job handler in `src/task-server/index.js` returns a promise that never settles, and
  that is load-bearing, not a bug. `mqu` acks a message only after the handler's promise resolves, so
  leaving it pending keeps the message assigned to this instance — which is what makes exactly one
  running instance own the `node-schedule` registrations. Resolving it would ack the message, the
  message would leave the queue, and after a restart nothing would register the schedules again.
- Logging goes through `src/infra/log.js`, which wires totlog appenders from env variables.

## Git rules

- Local commits and `git fetch` are fine.
- **Writing to a remote is strictly forbidden without the user's explicit consent for that specific
  operation.** This covers `git push` (including `--force`), creating or deleting remote branches and
  tags, opening or merging pull requests, and publishing to npm.
- Ask immediately before the operation and name exactly what it will change. Consent for one
  operation is never consent for the next one, even on the same branch minutes later.
- A bare "yes" arriving together with a new task is not consent to push — it answers the task, not a
  question asked earlier in the conversation. Finish the task, then ask again.
- This repository has two remotes: `origin` (lafayette, the fork that is worked on) and `titarenko`
  (upstream). The same rule applies to both.
