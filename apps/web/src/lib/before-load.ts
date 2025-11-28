import { redirect } from "@tanstack/react-router";

import { getSession } from "./auth-server-function";

export const shouldBeLoggedIn = async () => {
  const { data: session, error } = await getSession();

  if (!session || error) {
    throw redirect({ to: "/" });
  }

  return {
    session: session
  };
};

export const shouldNotBeLoggedIn = async () => {
  const { data: session } = await getSession();

  if (session) {
    throw redirect({ to: '/admin/me' });
  }
};