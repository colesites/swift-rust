'use cache';
let n = 0;
export async function getCount() { n++; return n; }
export const LABEL = "uc"; // non-async export → passthrough
