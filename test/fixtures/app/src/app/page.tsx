import Image from "swift-rust/image";
import { Widget } from "@/components/widget";
const BLUR = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
export default function Home(){ return <main><h1 data-home>Home</h1><Widget /><Image src="/a.jpg" alt="a" width={800} height={600} placeholder="blur" blurDataURL={BLUR} /></main>; }
