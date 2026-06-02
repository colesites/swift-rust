import { jsx } from "swift-rust/jsx-runtime";

export default function Page() {
  return jsx("main", { className: "page" }, jsx("h1", null, "Hello from srspack"));
}
