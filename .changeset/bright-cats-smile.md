---
---

Show the current page in the web navigation, remove the duplicate UI showcase, and refine the
blog, About, and Contact layouts. Add a homepage CTA for the dedicated Swift Rust UI site. Rework
the UI site with full-width page chrome, a restrained black-and-white visual system, and a cleaner
component showcase. Add searchable documentation to both docs sites, correct generated starter
links, and repair Google and local font loading across framework apps and generated projects.
Refine both documentation command palettes with reliable outside-click dismissal, and isolate
Google font stylesheets so one family can never make every preview fall back.
Make framework startup reliable on Windows by enforcing the supported Bun version, using the
installed Bun executable directly, removing POSIX-only build paths, and correcting native binary
packaging and installation.
Read the framework version from the installed `swift-rust` package everywhere it is displayed,
including the startup banner, health endpoint, and development error overlay.
Keep private documentation and example apps out of the npm release build gate so a site prerender
failure cannot block publishing the framework packages.
