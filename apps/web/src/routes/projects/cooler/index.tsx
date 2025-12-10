import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/cooler/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/projects/cooler/"!</div>;
}
