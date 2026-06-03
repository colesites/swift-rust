import { stats, trafficMax, trafficSeries } from "@/lib/stats";

export async function GET() {
  return Response.json({
    stats,
    traffic: {
      series: trafficSeries,
      max: trafficMax,
    },
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
    },
  });
}
