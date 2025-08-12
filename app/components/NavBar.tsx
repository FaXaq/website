import { Breadcrumb, HStack, IconButton } from "@chakra-ui/react"
import { ColorModeButton } from "./ui/color-mode"
import { LuHouse } from "react-icons/lu"
import { Link } from "@/components/Link"
import { LocaleSelector } from "./LocaleSelector"
import { usePathname } from "next/navigation"
import _ from "lodash"
import React from "react"

interface Crumb {
  label: string;
  path?: string;
}

export const NavBar = () => {
  const location = usePathname();
  const locations = location.split("/").filter(l => !_.isEmpty(l));

  const breadcrumbs: Crumb[] = [{
    label: "",
    path: "/"
  }];

  locations.forEach((l, i) => {
    console.log(locations, l, i)
    breadcrumbs.push({
      label: l,
      path: `/${locations.slice(0, i + 1).join("/")}`
    })
  })

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
                  <Breadcrumb.Link href={crumb.path}>
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
        <LocaleSelector />
        <ColorModeButton />
      </HStack>
    </HStack>
  )
}