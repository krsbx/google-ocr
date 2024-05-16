import axios from 'axios';
import env from '../utils/env';

const instance = axios.create({
  baseURL: env.VITE_API_URL,
});

export default instance;
