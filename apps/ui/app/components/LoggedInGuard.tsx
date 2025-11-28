import { redirect } from "next/navigation";

import { trpcServer } from "@/utils/trpc/server";

export const LoggedInGuard = async ({ children }: { children: React.ReactNode }) => {
  // Guard: check if user is logged in
  let loggedIn = false;
  try {
    const user = await trpcServer.user.me.query();
    loggedIn = !!user;
  } catch (e) {
    loggedIn = false;
  }

  if (!loggedIn) {
    redirect('/');
  }

  return <>{children}</>;
};