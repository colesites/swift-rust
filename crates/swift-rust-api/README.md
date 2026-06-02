# `swift-rust-api`

HTTP request and response helpers shared between the dev server and the
production binary.

## What's in here

- `RequestContext` — parsed request with path, query, headers, cookies, body
- `PageResponse` — builder for HTML responses with status + headers
- `ApiError` — typed error that maps to status codes and JSON bodies
- `current_timestamp`, `short_id` — tiny utilities

## Why

We had three places that did the same cookie parsing. Now we have one
place. Future us: thank past us.
