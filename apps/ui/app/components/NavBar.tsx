"use client";

import { Breadcrumb, HStack, IconButton } from "@chakra-ui/react";
import _ from "lodash";
import { usePathname } from "next/navigation";
import React from "react";
import { LuHouse } from "react-icons/lu";

import { Link } from "@/components/Link";
import { useAuth } from "@/hooks/useAuth";
import { isClient } from "@/lib/config";

import { LocaleSelector } from "./LocaleSelector";
import { ColorModeButton } from "./ui/color-mode";

interface Crumb {
  label: string;
  path?: string;
}

export const NavBar = () => {
  const location = usePathname();
  // slice(2) to remove home & locale from url
  const locations = location.split("/").slice(2).filter(l => !_.isEmpty(l));

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
      <HStack><Link href="/">
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
                  <Breadcrumb.Link href={isClient ? encodeURI(crumb.path || '') : crumb.path}>
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
          <Link href="/admin/me">{authUser?.email}</Link>
        )}
        <LocaleSelector />
        <ColorModeButton />
      </HStack>
    </HStack>
  );
};