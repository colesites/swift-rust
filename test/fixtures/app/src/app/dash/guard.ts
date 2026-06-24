import { type GuardContext, redirect } from "swift-rust/router";

export default function guard(ctx: GuardContext) {
  if (!ctx.searchParams.ok) return redirect("/login");
}
