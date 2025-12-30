import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { authUrl } from "./config";

export const authClient = createAuthClient({
  baseURL: authUrl,
  plugins: [usernameClient()]
});