import { cookies, headers } from 'next/headers';
import React, { Suspense } from 'react';

import { ACCESS_TOKEN_COOKIE_KEY } from '@/const';

import type { Response } from '../../api.client';
import { ApiClient } from '../../api.client';
import { AppLayout } from './layout.client';

interface AppLayoutProps {
  children: React.ReactNode
}

type User = Response<"get", "/users/me">;

async function fetchUser(): Promise<User | undefined> {
  const headersList = Object.fromEntries((await headers()).entries());
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value;

  if (!token) return undefined;

  const { data } = await ApiClient.GET("/users/me", { headers: {
      ...headersList,
      Authorization: `Bearer ${token}`
    }
  });
  return data;
}

async function ServerLayout ({ children }: AppLayoutProps) {
  const user = await fetchUser();

  return <AppLayout user={user}>
    {children}
  </AppLayout>;
}

export default function SuspendedAppLayout(props: AppLayoutProps) {
  return <Suspense><ServerLayout {...props} /></Suspense>;
}
