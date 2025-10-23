import axios from 'axios';

axios.interceptors.request.use(
    config => {
        config.headers.Authorization = `Bearer ${localStorage.getItem('Authorization')}`;
        return config;
    },
    error => Promise.reject(error)
);

export {axios as axiosInstance};
