import { jsx } from "swift-rust/jsx-runtime";
import "./global.css";

export default function RootLayout({ children }: { children: unknown }) {
  return jsx("html", null, jsx("body", null, children));
}
