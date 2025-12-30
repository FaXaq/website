import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/blog')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
