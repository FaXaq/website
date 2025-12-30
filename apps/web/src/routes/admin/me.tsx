import {
  Button,
  Container,
  Text,
  VStack,
} from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';

import { useAuth } from '@/hooks/useAuth';
import { shouldBeLoggedIn } from '@/lib/before-load';


export const Route = createFileRoute('/admin/me')({
  beforeLoad: shouldBeLoggedIn,
  loader: async ({ context }) => {
    return {
      session: context.session?.session,
      user: context.session?.user,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useLoaderData();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate({ to: '/admin/login' });
  };

  return (
    <Container p={6}>
      <VStack maxW="600px" mx="auto" alignItems="start" gap={4}>
        <Text>User: {user?.name}</Text>
        <Text>Email: {user?.email}</Text>
        <Text>Username: {user?.username}</Text>
        <Text>ID: {user?.id}</Text>
        <Button onClick={() => {
          handleSignOut();
        }}>Sign Out</Button>
      </VStack>
    </Container>
  );
}
