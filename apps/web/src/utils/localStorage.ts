import { SignInEmailSchema } from "@repo/schemas/api/procedures/user";

import type { RouterOutput } from "./trpc/types";

export const USER_LOCALSTORAGE_KEY = 'u';

export const setLSUser = (user: NonNullable<RouterOutput["user"]["singInEmail"]>["user"]) => {
  localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(user));
};

export const getLSUser = () => {
  const user = localStorage.getItem(USER_LOCALSTORAGE_KEY);
  if (!user) {
    throw new Error("No user in Local Storage");
  }
  const typedUser = SignInEmailSchema.parse(JSON.parse(user));
  return typedUser;
};

export const deleteLSUser = () => {
  localStorage.removeItem(USER_LOCALSTORAGE_KEY);
};