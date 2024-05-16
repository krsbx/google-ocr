import OpenAI from 'openai';
import env from '../../../utils/env';

const openai = new OpenAI({
  apiKey: env.OPEN_AI_API_KEY,
});

export default openai;
