import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535),
  DATABASE_URL: z.url(),
  ADMIN_GOOGLE_ID: z.string().nonempty(),
  GOOGLE_CLIENT_ID: z.string().nonempty(),
  GOOGLE_CLIENT_SECRET: z.string().nonempty(),
  GOOGLE_REDIRECT_URI: z.url(),
  OAUTH_STATE_SECRET: z.string().nonempty(),
  CLIENT_ORIGIN: z.url(),
  ACCESS_TOKEN_SECRET: z.string().nonempty(),
  YOUTUBE_API_KEY: z.string().nonempty(),
})

const envParsed = envSchema.safeParse(process.env)

if (envParsed.error) {
  console.error('Failed to parse environment variables.')
  console.error(z.prettifyError(envParsed.error))
  process.exit(1)
}

export default envParsed.data
