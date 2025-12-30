import { createFileRoute, redirect } from '@tanstack/react-router';

import { getSession } from '@/lib/auth-server-function';

export const Route = createFileRoute('/admin/')({
  beforeLoad: async () => {
    const { data: session } = await getSession();
    if (session) {
      throw redirect({ to: '/admin/me' });
    }
    throw redirect({ to: '/admin/login' });
  },
});
