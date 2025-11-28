import { Breadcrumb, BreadcrumbCurrentLink, HStack, IconButton } from "@chakra-ui/react";
import { Link as RouterLink,useRouterState } from "@tanstack/react-router";
import _ from "lodash";
import React from "react";
import { LuHouse } from "react-icons/lu";

import { Link } from "@/components/Link";
import { useAuth } from "@/hooks/useAuth";

import { LocaleSelector } from "./LocaleSelector";
import { ColorModeButton } from "./ui/color-mode";

interface Crumb {
  label: string;
  path?: string;
}

export const NavBar = () => {
  const matches = useRouterState({ select: (s) => s.matches });
  const breadcrumbs: Crumb[] = matches.filter((match) => !match.pathname.endsWith('/')).map((match) => ({
    label: match.pathname.split('/').pop()!,
    path: match.pathname,
  }));

  const { user, isSignedIn } = useAuth();

  return (
    <HStack p={2} style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid',
      borderColor: 'gray.200'
    }} justifyContent="space-between" bg="bg.subtle">
      <HStack>
        <Link to="/">
          <IconButton aria-label="Search database" variant="outline">
            <LuHouse />
          </IconButton>
        </Link>
      {breadcrumbs.length > 0 && (
        <Breadcrumb.Root>
          <Breadcrumb.List>
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb.path}>
                <Breadcrumb.Item>
                  { i === breadcrumbs.length - 1 ? (
                    <BreadcrumbCurrentLink asChild>
                      <RouterLink to={crumb.path}>{_.capitalize(crumb.label).replaceAll("-", " ")}</RouterLink>
                    </BreadcrumbCurrentLink>
                  ) : (
                    <Breadcrumb.Link asChild>
                      <RouterLink to={crumb.path}>{_.capitalize(crumb.label).replaceAll("-", " ")}</RouterLink>
                    </Breadcrumb.Link>
                  )}
                </Breadcrumb.Item>
                {i < breadcrumbs.length - 1 && <Breadcrumb.Separator />}
              </React.Fragment>
            ))
            }
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )}
      </HStack>
      <HStack gap={2}>
        { isSignedIn && (
          <Link to="/admin/me">{user?.email}</Link>
        )}
        <LocaleSelector />
        <ColorModeButton />
      </HStack>
    </HStack>
  );
};