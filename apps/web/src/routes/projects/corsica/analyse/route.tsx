import { createFileRoute, Outlet } from '@tanstack/react-router';
import React from 'react';

import { CustomFileProvider } from '@/components/corsica/analyse/context/CustomFileContext';

export const Route = createFileRoute('/projects/corsica/analyse')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <CustomFileProvider>
      <Outlet />
    </CustomFileProvider>
  );
}