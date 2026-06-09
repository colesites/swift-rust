'use client';
import { useState } from "react";
export function Counter({ start = 0, label = "count" }: { start?: number; label?: string }) {
  const [n, setN] = useState(start);
  return <button data-counter onClick={() => setN(n + 1)}>{label}:{n}</button>;
}
