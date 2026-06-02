export type Stat = {
  label: string;
  value: string;
  delta: number;
  context: string;
};

export const stats: Stat[] = [
  { label: "Total requests", value: "2.4M", delta: 12.4, context: "Last 30 days" },
  { label: "Avg latency", value: "14ms", delta: -8.1, context: "p50, streaming SSR" },
  { label: "Cache hit rate", value: "97.2%", delta: 0.4, context: "Edge cache" },
  { label: "Error rate", value: "0.03%", delta: -22.0, context: "5xx responses" },
];

export const trafficSeries: Array<{ day: string; requests: number }> = [
  { day: "Mon", requests: 312000 },
  { day: "Tue", requests: 298000 },
  { day: "Wed", requests: 354000 },
  { day: "Thu", requests: 401000 },
  { day: "Fri", requests: 482000 },
  { day: "Sat", requests: 367000 },
  { day: "Sun", requests: 221000 },
];

export const trafficMax = Math.max(...trafficSeries.map((d) => d.requests));
