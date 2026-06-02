# `swift-rust-taskless`

Background task scheduling. The work the build pipeline forgot to do.

## What it does

A small task pool that:

- Runs jobs on a dedicated tokio runtime
- Deduplicates identical in-flight jobs by `TaskKey`
- Surfaces back-pressure so request handlers can wait
- Provides a `debounce` helper for hot file-watcher events

## When to use it

- File-watcher triggers: re-bundle a route, run type checks, etc.
- Telemetry: ship events without blocking the request path
- Background cleanup: prune stale build artefacts

## When not to use it

- Synchronous work needed for a response. Use the request thread.
- CPU-bound work. Use a thread pool with `rayon` instead.

The name comes from the Next.js monorepo, where a similar crate
shadows the same responsibilities. We liked the name.
