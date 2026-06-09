import { getCount } from "./data";
export default async function loader() { return { n: await getCount() }; }
