import axios from 'axios';
import { Endpoints } from './endpoints';

const baseURL = Endpoints.LOCAL;

const instance = axios.create({
    baseURL,
});

// const jwtToken = JSON.stringify(localStorage.getItem('token'));
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || '';
    // Log the request method and URL on every request (not body)
    console.log(
        `Axios calling: ${(config?.method || 'NO_METHOD').toUpperCase()} at ${
            config.url || 'NO_URL'
        }`
    );
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
    (response) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (response && response.data) || response,
    (error) => {
        if (error.response.status === 401) {
            localStorage.clear();
            // window.location = '/login';
            return;
        }
        return Promise.reject(
            (error && error.response && error.response.data) || error
        );
    }
);
export default instance;
