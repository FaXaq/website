import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/corsica/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/projects/corsica/"!</div>;
}
