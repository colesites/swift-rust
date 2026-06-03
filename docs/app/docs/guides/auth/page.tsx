import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "Authentication" };

export default function AuthPage() {
  return (
    <DocArticle>
      <h1>Authentication</h1>
      <p>
        Swift Rust doesn't ship with an authentication library. It works with any library that uses
        the standard Fetch <code>Request</code> and <code>Response</code> APIs.
      </p>

      <h2>Cookie-based sessions</h2>
      <p>The simplest pattern. Set a cookie on login, read it on every request.</p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/login/route.ts</span>
        </div>
        <pre>
          <code>{`import type { RouteHandler } from "swift-rust/router";
import { verifyPassword, createSession } from "@/lib/auth";

export const POST: RouteHandler = async ({ request }) => {
  const { email, password } = await request.json();
  const user = await verifyPassword(email, password);
  if (!user) return new Response("Invalid credentials", { status: 401 });

  const session = await createSession(user.id);
  return new Response(JSON.stringify({ user }), {
    headers: {
      "Set-Cookie": \`session=\${session.id}; HttpOnly; SameSite=Lax; Path=/\`,
    },
  });
};`}</code>
        </pre>
      </div>

      <h2>Reading the session</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>middleware.ts</span>
        </div>
        <pre>
          <code>{`import { NextResponse } from "swift-rust/router";

export function middleware(request: Request) {
  const session = request.cookies.get("session");
  if (!session) return NextResponse.redirect("/login");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};`}</code>
        </pre>
      </div>

      <h2>OAuth</h2>
      <p>
        For OAuth, redirect the user to the provider's authorization URL, then handle the callback
        in a route handler.
      </p>

      <h2>Recommended libraries</h2>
      <ul>
        <li>
          <a href="https://lucia-auth.com">Lucia</a> — session management
        </li>
        <li>
          <a href="https://authjs.dev">Auth.js</a> — multi-provider OAuth
        </li>
        <li>
          <a href="https://www.better-auth.com">Better Auth</a> — modern TypeScript-first auth
        </li>
      </ul>
    </DocArticle>
  );
}
