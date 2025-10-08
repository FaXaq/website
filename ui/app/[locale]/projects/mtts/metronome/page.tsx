'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const ClientOnlyComponent = dynamic(
  async () => import('./page.client'),
  { ssr: false }
);

const MyPage = () => {
  return (
    <ClientOnlyComponent />
  );
};

export default MyPage;