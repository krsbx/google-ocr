import { z, BlazeCreator, BlazeError } from '@busy-hour/blaze';
import openai from '../utils/openai';

const summarizeValidator = BlazeCreator.action.validator({
  body: z.object({
    results: z.record(z.array(z.string())),
  }),
});

const summarizeOcr = BlazeCreator.action({
  rest: 'POST /summarize',
  validator: summarizeValidator,
  throwOnValidationError: true,
  meta: {
    prompt: `From the given text, get the following information and return it a JSON object without any extra information:
  - Issued Date
  - Lawyer's ZIP Code
  - Lawyer's Address
  - Lawyer's Office Name 
  - Lawyer's TEL
  - Lawyer's FAX
  - Lawyer's Certification
  - Representative Lawyer's Name
  - Debtor's Address
  - Debtor's Name (Pronunciation)
  - Debtor's Name
  - Debtor's Birthday
  - Debtor's TEL`,
  },
  async handler(ctx) {
    const { results } = await ctx.request.body();
    const joined = Object.values(results).join('\n');
    const content = [ctx.meta.get('prompt'), joined].join('\n\n');

    const { choices, usage } = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    console.log(
      'Usage: ',
      usage?.completion_tokens,
      usage?.prompt_tokens,
      usage?.total_tokens
    );

    if (!choices[0].message.content) {
      throw new BlazeError({
        errors: null,
        message: 'No summary generated',
        status: 400,
      });
    }

    try {
      const result = JSON.parse(choices[0].message.content);

      return result;
    } catch {
      throw new BlazeError({
        errors: null,
        message: 'No summary generated',
        status: 400,
      });
    }
  },
});

export default summarizeOcr;
