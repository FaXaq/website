"use client";

import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthContext } from "@/[locale]/contexts/AuthContext";

const Me = () => {
  const { isLoggedIn, user, logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, []);

  return <>
  <Text>
    { user?.email }
  </Text>
  <Button onClick={() => logout()}>Logout</Button>
  </>;
};

export default Me;