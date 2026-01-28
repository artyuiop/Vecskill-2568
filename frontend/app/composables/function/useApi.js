import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000",
})

api.interceptors.request.use((req) => {
    const auth = authStore()
    if(auth.token){
        req.headers.Authorization = `Bearer ${auth.token}`
    }
    return req
})