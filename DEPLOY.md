# Deploying swift-rust

You have **13 public npm packages** and **2 Vercel apps** to ship. This is the exact runbook.

## Before you start (one-time, manual)

### 1. Create the npm org
1. Browser → https://www.npmjs.com/org/create → create org **`swift-rust`** (free)
2. The org is created automatically on first scoped publish too, so this step is optional but recommended

### 2. Get an npm Automation token
1. Browser → https://www.npmjs.com → click your avatar → **Access Tokens** → **Generate New Token**
2. Choose **Automation** (NOT "Publish" — that's interactive and won't work in CI)
3. Set expiration to your preference (90 days / 1 year)
4. **Copy the token** — npm only shows it once. It looks like `npm_xxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Add the token to GitHub
1. Browser → your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `NPM_TOKEN`
4. Value: paste the token from step 2
5. Click **Add secret**

That's it for auth. No need to create a separate "canary" branch — changesets is configured to release on push to `main`.

## Releasing v0.1.0 to npm

### First release: do it locally
The CI workflow needs the GitHub + npm auth to be wired up first. The simplest first-release path is local:

```bash
git pull                         # make sure you're on the latest main
npm login                        # log in as the account that owns @swift-rust
bun install --frozen-lockfile
bun run build
bun run test
bunx changeset version           # applies the bumps from .changeset/v0.1.0-initial-release.md
bunx changeset publish           # publishes all 13 packages to npm in dep order
git push --follow-tags
```

Watch the output — it'll show 13 publishes (or 12 if `swift-rust` fails on postinstall).

### After the first release: CI takes over
The `.github/workflows/release.yml` workflow runs on every push to `main`. The `@changesets/action` step will:
- If you added new `.changeset/*.md` files → open a "chore(release): version packages" PR
- When that PR is merged → run `bun run release` and publish to npm

So the ongoing flow is:
1. Make code changes
2. `bunx changeset` → write a changeset describing the change
3. Commit + push to a branch → open PR → merge to `main`
4. CI opens the version PR → merge it
5. CI publishes the new version to npm

## Vercel — 2 projects

### Project 1: `swift-rust-docs`
1. https://vercel.com/new → **Import** your `swift-rust/swift-rust` repo
2. Configure:
   - **Project Name:** `swift-rust-docs`
   - **Root Directory:** `docs`
   - Framework Preset: **Other** (the `vercel.json` in `docs/` already specifies build/install/output)
3. **Settings → Domains → Add** `swift-rust.dev`

### Project 2: `web`
1. Add New Project again, same repo
2. Configure:
   - **Project Name:** `web`
   - **Root Directory:** `apps/web`
   - Framework Preset: **Other** (`apps/web/vercel.json` is preconfigured)
3. **Settings → Domains → Add** `swift-rust.dev` as an alias (or a subdomain like `app.swift-rust.dev`)

Both projects share the same GitHub repo. Vercel detects them as monorepo subprojects automatically because of the `vercel.json` per-root.

## What I already did locally

- Added `repository` + `bugs` + `homepage` to all 13 packages
- Created `.github/workflows/release.yml` (triggers on push to `main`)
- Created `docs/vercel.json` and `apps/web/vercel.json`
- Created `.changeset/v0.1.0-initial-release.md` to bump all 13 packages
- Changed `.changeset/config.json` `baseBranch` from `canary` → `main`
- Removed the `vercel.json` from `examples/full-demo` (since it's just a `create-swift-rust` template, not a deploy target)

## What still needs to be done by you

- npm account + `@swift-rust` org (optional — created on first scoped publish)
- `NPM_TOKEN` secret on GitHub (3 clicks)
- 2 Vercel projects (3 minutes each)
- DNS for `swift-rust.dev`
