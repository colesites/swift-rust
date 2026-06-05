'use node';
'use guard';
import { useLoaderData } from "swift-rust/router";
import loader from "./loader";
export default function Dash(){ const data = useLoaderData<typeof loader>(); return <main data-dash>user={data?.user ?? "?"}</main>; }
