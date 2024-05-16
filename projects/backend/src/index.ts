import path from 'node:path';
import './utils/env';
import { fileURLToPath } from 'node:url';
import { Blaze } from '@busy-hour/blaze';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Blaze({
  autoStart: true,
  path: path.resolve(__dirname, 'services'),
});

app.serve(3000, () => {
  console.log('Server listening on port 3000');
});