import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/projects')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Outlet />
  );
}
