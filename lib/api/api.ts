import axios from 'axios';

// NEXT_PUBLIC_API_URL: локально http://localhost:3000, після деплою — URL застосунку на Vercel
const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
