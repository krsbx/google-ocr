import { z, BlazeCreator } from '@busy-hour/blaze';
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

    const { choices, usage } = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: [ctx.meta.get('prompt'), joined].join('\n\n'),
        },
      ],
      model: 'gpt-3.5-turbo-16k',
    });

    console.log(
      'Usage: ',
      usage?.completion_tokens,
      usage?.prompt_tokens,
      usage?.total_tokens
    );

    return {
      result: choices[0].message.content,
    };
  },
});

export default summarizeOcr;
