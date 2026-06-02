import { posts } from "@/lib/posts";

export async function GET({ query }: { query: Record<string, string> }) {
  const q = (query.q || "").toLowerCase();
  if (!q) {
    return Response.json({ results: [], query: "", total: 0 });
  }
  const results = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)),
  );
  return Response.json({ results, query: q, total: results.length });
}
