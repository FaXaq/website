import { Container } from "@chakra-ui/react";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Container py={6} flex="1">
    {children}
  </Container>
}