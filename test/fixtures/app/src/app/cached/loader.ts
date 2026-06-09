import { cache } from "swift-rust/cache";
let n = 0;
const getN = cache(async () => { n++; return n; }, { tags: ["counter"] });
export default async function loader() { return { n: await getN() }; }
