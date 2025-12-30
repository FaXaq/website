import type { RouterOutput } from "@/lib/trpc/types";

export interface RouterContext {
  user: RouterOutput["user"]["me"]
}