import { useLoaderData } from "swift-rust/router";
export default function Page() {
  const d = useLoaderData<{ n: number }>();
  return <main data-uc>n={d?.n}</main>;
}
