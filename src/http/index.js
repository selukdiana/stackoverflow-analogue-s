import axios from 'axios';

const api = axios.create({
  // withCredentials: true,
  baseURL: 'https://codelang.vercel.app/api/',
});

// axios.defaults.withCredentials = true;

// api.interceptors.request.use((config) => {
//   // config.headers['Content-Type'] = 'application/json';
//   return config;
// });

export default api;
