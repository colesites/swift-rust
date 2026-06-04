import { getPost } from "@/lib/posts";

export async function GET({ params }: { params: { id: string } }) {
  const post = getPost(params.id);
  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }
  return Response.json(post);
}

export async function PUT({
  params,
  body,
}: { params: { id: string }; body: { title?: string; content?: string } }) {
  const post = getPost(params.id);
  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }
  return Response.json({
    ...post,
    ...body,
    slug: post.slug,
    updatedAt: new Date().toISOString(),
  });
}

export async function DELETE({ params }: { params: { id: string } }) {
  const post = getPost(params.id);
  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }
  return Response.json({ slug: post.slug, status: "deleted" });
}
