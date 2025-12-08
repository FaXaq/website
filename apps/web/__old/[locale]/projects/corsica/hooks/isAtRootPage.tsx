'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useIsAtRootPage() {
  const [fullPage, setFullPage] = useState(false);
  const path = usePathname();

  useEffect(() => {
    if (path === '/projects/corsica') {
      setFullPage(true);
    } else {
      setFullPage(false);
    }
  }, [path]);

  return fullPage;
}
