'use node';
export default function Item({ params }: any){ return <main data-item>id={params?.id ?? "?"}</main>; }
