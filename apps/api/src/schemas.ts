import { z } from 'zod'

export const nextURLSchema = z
  .string()
  .startsWith('/')
  .refine((url) => !url.startsWith('//'))
