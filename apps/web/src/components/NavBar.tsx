import { Breadcrumb, HStack, IconButton } from "@chakra-ui/react";
import { useRouterState } from "@tanstack/react-router";
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
  const routerState = useRouterState();
  const location = routerState.location.pathname;
  // slice(2) to remove home & locale from url
  const locations = location.split("/").filter(l => !_.isEmpty(l));

  console.log('locations', location);

  const breadcrumbs: Crumb[] = [{
    label: "",
    path: "/"
  }];

  locations.forEach((l, i) => {
    breadcrumbs.push({
      label: decodeURI(l),
      path: encodeURI(`/${locations.slice(0, i + 1).join("/")}`)
    });
  });

  const { authUser, isLoggedIn } = useAuth();

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
              <React.Fragment key={crumb.label}>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href={encodeURI(crumb.path || '')}>
                    {_.capitalize(crumb.label).replaceAll("-", " ")}
                  </Breadcrumb.Link>
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
        { isLoggedIn && (
          <Link to="/admin/me">{authUser?.email}</Link>
        )}
        <LocaleSelector />
        <ColorModeButton />
      </HStack>
    </HStack>
  );
};