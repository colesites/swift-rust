# @swift-rust/font

The font component. Resolves Google Fonts and local fonts, generates `className` and CSS variable names that the bundler uses to wire up `@font-face` declarations at build time.

## Usage

### Google

```tsx
import { Inter } from "swift-rust/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html className={inter.className}><body>{children}</body></html>;
}
```

> Or import from `@swift-rust/font` directly.

### Local

```tsx
import { localFont } from "swift-rust/font/local";
export const myFont = localFont({ src: "./fonts/MyFont.woff2" });
// then import it by name: import { myFont } from "./fonts";
```

The package also ships named local faces you can import directly, like Google fonts:

```tsx
import { Lausanne, VarentGrotesk } from "swift-rust/font/local";
```

## Available Google families

`Inter`, `Roboto`, `Poppins`, `Manrope`, `IBM Plex Sans`, `JetBrains Mono`. Add your own by exporting from `@swift-rust/font/google`.
