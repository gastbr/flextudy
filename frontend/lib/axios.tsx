import axios, { AxiosInstance } from 'axios';

console.log("💡 ENV: INTERNAL_API_URL =", process.env.INTERNAL_API_URL);
console.log("💡 ENV: NEXT_PUBLIC_API_URL =", process.env.NEXT_PUBLIC_API_URL);

const baseURL = typeof window === "undefined"
    ? process.env.INTERNAL_API_URL // SSR (Node dentro de Docker)
    : process.env.NEXT_PUBLIC_API_URL; // Navegador

console.log('axios -------------------', baseURL);

const api: AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true
});

export default api;
