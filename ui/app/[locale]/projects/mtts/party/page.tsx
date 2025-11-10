import { Container } from "@chakra-ui/react";

import { getConfig } from "@/lib/config";


export default function PartyClient() {
  const config = getConfig();
  return <Container>
    <form action={`${config.public.serverUrl}/mtts/party/join`} method="POST">
      <input type="hidden" name="redirectUrl" value={config.public.appUrl + '/projects/mtts/party/room'} />
      <button type="submit">Join MTTS Party</button>
    </form>
  </Container>;
}