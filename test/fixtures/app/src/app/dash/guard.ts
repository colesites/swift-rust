import { redirect } from "swift-rust/router";
export default function guard(ctx: any){ if(!ctx.searchParams.ok) return redirect("/login"); }
