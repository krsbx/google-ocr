import { z } from '@busy-hour/blaze';
import { config } from 'dotenv';

config();

const envSchema = z.object({
  GOOGLE_APPLICATION_CREDENTIALS: z.string(),
  GOOGLE_PROJECT_ID: z.string(),
  GOOGLE_PROJECT_LOCATION: z.string(),
  GOOGLE_OCR_PROCESSOR_ID: z.string(),
});

export default envSchema.parse(process.env);
