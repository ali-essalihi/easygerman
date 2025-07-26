import { z } from 'zod'

export const nextURLSchema = z
  .string()
  .startsWith('/')
  .refine((url) => !url.startsWith('//'))

export const oauthStateSchema = z.jwt()

export const googleCallbackQuerySchema = z.union([
  z.object({ state: oauthStateSchema, code: z.string().nonempty() }),
  z.object({ state: oauthStateSchema, error: z.string().nonempty() }),
])
