# @swift-rust/mdx

MDX support. Author content in `.mdx` files with JSX components inline. The bundler picks up these files and routes them as pages.

## Usage

```mdx
---
title: Hello
---

import { Image } from "swift-rust/image";

# {frontmatter.title}

<Image src="/hero.jpg" width={1200} height={600} alt="Hero" />
```
