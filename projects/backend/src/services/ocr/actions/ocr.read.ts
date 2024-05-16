import { BlazeCreator, z } from '@busy-hour/blaze';
import OCR from '../utils/google';

const readValidator = BlazeCreator.action.validator({
  body: z.object({
    file: z
      .custom<File>()
      .transform((data, ctx) => {
        if (!data.type.includes('pdf')) {
          ctx.addIssue({
            code: 'custom',
            message: 'Only PDF files are allowed',
          });
        }

        return data;
      })
      .openapi({
        example: {
          size: 1729,
          type: 'application/pdf',
          name: 'file.pdf',
          lastModified: 1715645170595,
        } as File,
      }),
  }),
});

const readOcr = BlazeCreator.action({
  rest: 'POST /',
  validator: readValidator,
  throwOnValidationError: true,
  async handler(ctx) {
    const { file } = await ctx.request.body();

    const buffer = await file.arrayBuffer();

    const results = await OCR.readFile(Buffer.from(buffer));

    return results;
  },
});

export default readOcr;
