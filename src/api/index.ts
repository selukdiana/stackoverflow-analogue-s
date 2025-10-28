import axios from 'axios';

const BASE_URL = 'https://codelang.vercel.app/api/';
const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
