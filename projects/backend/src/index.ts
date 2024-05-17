import path from 'node:path';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { fileURLToPath } from 'node:url';
import { Blaze } from '@busy-hour/blaze';
import env from './utils/env';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Blaze({
  autoStart: true,
  path: path.resolve(__dirname, 'services'),
});

app.router.use('*', cors());
app.router.use('*', secureHeaders());

app.serve(env.PORT, () => {
  console.log('Server listening on port 3000');
});
