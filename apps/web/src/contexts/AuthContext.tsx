import { redirect } from '@tanstack/react-router';
import type { ReactNode} from 'react';
import { createContext, useContext } from 'react';

import { authClient } from '@/lib/auth-client';
import type { RouterInput, RouterOutput } from '@/lib/trpc/types';


export type AuthUser = NonNullable<SignInResponse>["user"]

export type SignInResponse = RouterOutput["user"]["singInEmail"]
export type EmailSignInParams = RouterInput["user"]["singInEmail"]

interface AuthContextType {
  session: typeof authClient.$Infer.Session | null;
  signInEmailCallback: (user: typeof authClient.$Infer.Session["user"]) => void;
  signOutCallback: () => void;
  getBearer: () => string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session } = authClient.useSession();

  const signInEmailCallback = (user: typeof authClient.$Infer.Session["user"]) => {
    redirect({ to: "/" });
  };

  const signOutCallback = () => {
    redirect({ to: "/" });
  };

  const getBearer = () => {
    const bearer = authClient.useSession().data?.session.token;
    return bearer;
  };

  return <AuthContext.Provider value={{ session, signInEmailCallback, signOutCallback, getBearer }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}