import { createRouter, ErrorComponent } from '@tanstack/react-router';

import { deLocalizeUrl, localizeUrl } from "./paraglide/runtime.js";
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
    defaultErrorComponent: ({ error }) => {
      return <ErrorComponent error={error} />;
    }
  });

  return router;
}