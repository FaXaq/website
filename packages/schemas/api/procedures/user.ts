import z from "zod"

export const SignUpEmailSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  username: z.string()
})

export const SignInEmailSchema = z.object({
  email: z.email(),
  password: z.string(),
  rememberMe: z.boolean().optional()
})

export const SignInUsernameSchema = z.object({
  username: z.email(),
  password: z.string(),
  rememberMe: z.boolean().optional()
})

export const SignOutSchema = z.object({})