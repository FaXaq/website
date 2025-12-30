import { redirect } from "@tanstack/react-router";

import { trcpClient } from "@/lib/trpc/client";

export const LoggedInGuard = async ({ children }: { children: React.ReactNode }) => {
  // Guard: check if user is logged in
  let loggedIn = false;
  try {
    const user = await trcpClient.user.me.query();
    loggedIn = !!user;
  } catch (e) {
    loggedIn = false;
  }

  if (!loggedIn) {
    redirect({ to: '/' });
  }

  return <>{children}</>;
};