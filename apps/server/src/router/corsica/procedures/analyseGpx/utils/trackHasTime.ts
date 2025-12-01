import { GPXJson } from "@repo/schemas/api/procedures/corsica";

export function trackHasTime(file: GPXJson): boolean {
  return !!file.gpx.metadata?.time;
}