import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_USE_EXAMPLE: z.string().transform<boolean>((data) => data == 'true'),
});

export default envSchema.parse(import.meta.env);
