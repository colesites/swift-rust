import { posts } from "@/lib/posts";

export async function GET({ searchParams }: { searchParams: Record<string, string> }) {
  const tag = searchParams.tag;
  const filtered = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;
  const limit = Number.parseInt(searchParams.limit || "100", 10);
  return Response.json({
    posts: filtered.slice(0, limit),
    total: filtered.length,
    limit,
  });
}

export async function POST({
  body,
}: { body: { title?: string; slug?: string; content?: string } }) {
  if (!body?.title || !body?.slug) {
    return Response.json({ error: "title and slug are required" }, { status: 400 });
  }
  return Response.json(
    {
      id: String(Date.now()),
      slug: body.slug,
      title: body.title,
      status: "created",
    },
    { status: 201 },
  );
}
