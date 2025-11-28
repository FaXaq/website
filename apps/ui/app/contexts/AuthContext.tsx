"use client";

import { redirect, useRouter } from 'next/navigation';
import type { ReactNode} from 'react';
import { createContext, useContext, useState } from 'react';

import { deleteCookieAuth, getCookieAuth, setCookieAuth } from '@/utils/cookies';
import { deleteLSUser, setLSUser } from '@/utils/localStorage';
import type { RouterInput, RouterOutput } from '@/utils/trpc/types';


export type AuthUser = NonNullable<SignInResponse>["user"]

export type SignInResponse = RouterOutput["user"]["singInEmail"]
export type EmailSignInParams = RouterInput["user"]["singInEmail"]

interface AuthContextType {
  authUser: AuthUser | null;
  signInEmailCallback: (user: NonNullable<SignInResponse>) => void;
  signOutCallback: () => void;
  isLoggedIn: boolean;
  getBearer: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ auth, children }: { auth?: AuthUser, children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(auth ?? null);
  const router = useRouter();

  const signInEmailCallback = (response: NonNullable<SignInResponse>) => {
    setAuthUser(response.user);
    setLSUser(response.user);
    setCookieAuth(response.token);
    redirect("/");
  };

  const signOutCallback = () => {
    setAuthUser(null);
    deleteLSUser();
    deleteCookieAuth();
    router.push("/");
  };

  const getBearer = () => {
    const bearer = getCookieAuth();
    return bearer;
  };

  const isLoggedIn = authUser !== null;

  return <AuthContext.Provider value={{ authUser, signInEmailCallback, signOutCallback, isLoggedIn, getBearer }}>
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