export async function POST({
  body,
}: { body: { name?: string; email?: string; subject?: string; message?: string } }) {
  if (!body?.name || !body?.email || !body?.message) {
    return Response.json({ error: "name, email, and message are required" }, { status: 400 });
  }
  if (!body.email.includes("@")) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  return Response.json({
    status: "received",
    ticket: `T-${Date.now().toString(36).toUpperCase()}`,
    receivedAt: new Date().toISOString(),
  });
}
