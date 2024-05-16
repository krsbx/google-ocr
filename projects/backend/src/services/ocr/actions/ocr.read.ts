import { BlazeCreator, z } from '@busy-hour/blaze';
import OCR from '../utils/google';

const bodySchema = z.object({
  file: z
    .custom<File>((data) => data)
    .openapi({
      type: 'file',
      example: {
        size: 1729,
        type: 'video/mp2t',
        name: 'users.create.ts',
        lastModified: 1715645170595,
      } as File,
    }),
});

const readOcr = BlazeCreator.action({
  rest: 'POST /',
  // validator: readValidator,
  throwOnValidationError: false,
  async handler(ctx) {
    const { file } = (await ctx.request.body()) as z.infer<typeof bodySchema>;
    const buffer = await file.arrayBuffer();

    const results = await OCR.readFile(Buffer.from(buffer));

    return results;
  },
});

export default readOcr;
