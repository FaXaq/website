"use client";

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import type { ReactNode} from 'react';
import { createContext, useContext, useState } from 'react';
import z from 'zod';

import { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY, USER_LOCALSTORAGE_KEY } from '@/const';

import type { Response } from '../../../api.client';

export const StoredUserSchema = z.object({
  email: z.email(),
  scopes: z.array(z.string())
});

export const UserSchema = StoredUserSchema.extend({
  token: z.string()
});

export type User = Response<"post", "/auth/login">
export type StoredUser = z.infer<typeof StoredUserSchema>;

interface AuthContextType {
  user: StoredUser | null;
  login: (user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
  getBearer: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ auth, children }: { auth?: StoredUser, children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(auth ?? null);
  const router = useRouter();

  const login = (userData: User) => {
    console.log(userData);
    const { access_token, refresh_token, ...nonSensibleUserdata } = userData;
    setUser(nonSensibleUserdata);
    localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(nonSensibleUserdata));
    Cookies.set(ACCESS_TOKEN_COOKIE_KEY, access_token);
    Cookies.set(REFRESH_TOKEN_COOKIE_KEY, refresh_token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_LOCALSTORAGE_KEY);
    Cookies.remove(ACCESS_TOKEN_COOKIE_KEY);
    Cookies.remove(REFRESH_TOKEN_COOKIE_KEY);
    router.push("/");
  };

  const getBearer: () => string = () => {
    const bearer = Cookies.get(ACCESS_TOKEN_COOKIE_KEY);
    if (!bearer) {
      throw new Error(`No ${ACCESS_TOKEN_COOKIE_KEY} in cookies`);
    }
    return bearer;
  };

  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn, getBearer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}