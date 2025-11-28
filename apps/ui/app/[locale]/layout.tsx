
import { trpcServer } from "@/utils/trpc/server";

import RootLayoutClient from "./layout.client";

type Props = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const fetchAuth = async () => {
  try {
    const user = await trpcServer.user.me.query();
    return user;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
interface LayoutProps {
  children: React.ReactNode;
}

async function Layout({ children }: LayoutProps) {
  const auth = await fetchAuth();
  return (
    <RootLayoutClient
      auth={auth ?? undefined}
    >
      {children}
    </RootLayoutClient>
  );
}

export default Layout;
