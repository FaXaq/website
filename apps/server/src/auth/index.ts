import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { Pool } from "pg";
import { config } from "../config";

export const auth = betterAuth({
  database: new Pool({
    connectionString: config.DATABASE_URL
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    username()
  ],
  secret: config.BETTER_AUTH_SECRET
});