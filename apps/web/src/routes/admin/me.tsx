import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/me')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/admin/me"!</div>;
}
