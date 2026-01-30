import axios from "axios";
export const api = axios.create()

api.interceptors.request.use((req) => {
  const config = useRuntimeConfig();
  const auth = authStore();
  req.baseURL = config.public.BASEAPI
  
  if (auth.token) {
    req.headers.Authorization = `Bearer ${auth.token}`;
  }
  return req;
});

