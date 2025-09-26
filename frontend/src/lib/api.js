import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    // baseURL: 'https://astra-backend-141e.onrender.com/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const authStorage = localStorage.getItem('auth-storage');

        if (authStorage) {
            const authState = JSON.parse(authStorage);
            const token = authState?.state?.token;

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;