# Deploying swift-rust

You have **13 public npm packages** and **2 Vercel apps** to ship. This is the exact runbook.

## Before you start (one-time, manual)

You need to do these 3 things by hand because they require your accounts:

### A. Create the npm org and names
1. Go to https://www.npmjs.com/org/create and create org **`swift-rust`**
2. Go to https://www.npmjs.com and confirm `swift-rust`, `create-swift-rust` are still free
3. `npm login` on your machine with the account that owns the org
4. Generate an **Automation** token at https://www.npmjs.com/settings/\<your-username\>/tokens (type = `Automation`, not `Publish`)

### B. Push the repo to GitHub
This local checkout has no commits yet:
```bash
git add -A
git commit -m "chore: initial commit"
gh repo create swift-rust/swift-rust --public --source=. --remote=origin --push
```
If you don't have `gh`, create the repo in the GitHub web UI and add the remote manually.

### C. Add `NPM_TOKEN` to GitHub secrets
GitHub → repo → Settings → Secrets and variables → Actions → **New repository secret**:
- Name: `NPM_TOKEN`
- Value: the Automation token from step A

Then push the new files:
```bash
git add -A
git commit -m "chore: add release workflow, vercel configs, v0.1.0 changeset"
git push
```

## Releasing v0.1.0 to npm (semi-automated)

Once the above is done:

### Option 1 — let CI do it (recommended)
The `release.yml` workflow is now in place. When you push to `canary`, the `@changesets/action` step will:
- If there are pending changesets → open a PR titled "chore(release): version packages" with version bumps applied
- When that PR is merged → run `bun run release` (which is `turbo run build && changeset publish`) and push all 13 packages to npm

So your flow is:
1. Cut a `canary` branch off `main`
2. `git push origin main:canary` (or merge main into canary)
3. CI opens the version PR — merge it
4. CI publishes v0.1.0 to npm

### Option 2 — publish locally
```bash
git checkout main
npm login
bun install --frozen-lockfile
bun run build
bun run test
bunx changeset version    # bumps package versions per .changeset/v0.1.0-initial-release.md
bunx changeset publish    # publishes all 13 packages in topological order
git push --follow-tags
```

The order is determined by `turbo` based on internal dependencies, so the `swift-rust` main package will publish last (after `@swift-rust/image`, `@swift-rust/font`, etc. are live).

## Vercel — 2 projects

### Project 1: `swift-rust-docs` (the documentation site)

1. https://vercel.com/new → Import `swift-rust/swift-rust`
2. Configure:
   - **Project Name:** `swift-rust-docs`
   - **Root Directory:** `docs`
   - **Build Command:** `bun run build` (from `vercel.json`)
   - **Install Command:** `bun install --frozen-lockfile` (from `vercel.json`)
   - **Output Directory:** `.swift-rust` (from `vercel.json`)
   - **Framework Preset:** Other
3. Add custom domain `swift-rust.dev` (Vercel → Settings → Domains → Add)

### Project 2: `full-demo`

1. Add New Project again, same repo
2. Configure:
   - **Project Name:** `full-demo`
   - **Root Directory:** `examples/full-demo`
   - Build/Install/Output: same as above (from its own `vercel.json`)
3. Add custom domain `demo.swift-rust.dev`

## After first release

- Tag the commit `v0.1.0`
- Draft GitHub release notes (changesets auto-generates CHANGELOG.md entries)
- Announce on Twitter/social with the install command:
  ```bash
  bun create swift-rust my-app
  cd my-app && bun dev
  ```

## What I already did locally (you don't need to redo)

- Added `repository` + `bugs` + `homepage` to 8 packages that were missing them
- Created `.github/workflows/release.yml` (changesets → npm automation)
- Created `docs/vercel.json` and `examples/full-demo/vercel.json`
- Created `.changeset/v0.1.0-initial-release.md` so the first release bumps all 13 packages

## What still needs to exist in your hands

- npm account + `@swift-rust` org + `swift-rust` + `create-swift-rust` names
- GitHub repo (this checkout has zero commits)
- `NPM_TOKEN` secret on GitHub
- Vercel account + 2 imported projects
- DNS for `swift-rust.dev` and `demo.swift-rust.dev`
