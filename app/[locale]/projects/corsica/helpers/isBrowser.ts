import { isClient } from "@/lib/config";

export function isBrowser() {
  return isClient;
}
