
import { useAuthContext } from "@/contexts/AuthContext";
import { authClient } from "@/lib/auth-client";
import type { RouterInput } from "@/lib/trpc/types";

export const useAuth = () => {
  const { session, signInEmailCallback, signOutCallback } = useAuthContext();

  const singInEmail = async (userData: RouterInput["user"]["singInEmail"]) => {
    const response = await authClient.signIn.email({
      email: userData.email,
      password: userData.password,
      rememberMe: userData.rememberMe ?? false,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    signInEmailCallback(response.data?.user);
  };

  const signOut = async () => {
    await authClient.signOut();
    signOutCallback();
  };

  return {
    session: session?.session,
    user: session?.user,
    singInEmail,
    signOut,
    isSignedIn: session?.session !== null && session?.session.expiresAt && session?.session.expiresAt > new Date()
  };
};