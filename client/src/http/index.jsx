import axios from "axios";

const $host = axios.create({
    baseURL: import.meta.env.VITE_API_URL 
});

const $authHost = axios.create({
    baseURL: import.meta.env.VITE_API_URL 
});

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
}

$authHost.interceptors.request.use(authInterceptor);

const $api = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_URL 
});

$api.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
})

$api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest && !originalRequest._isRetry) {
            originalRequest._isRetry = true;

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL }api/user/auth`, {withCredentials: true});

                localStorage.setItem('token', response.data.accessToken);

                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                return $api.request(originalRequest);
            } catch (e) {
                console.log('НЕ АВТОРИЗИРОВАН');
            }
        }

        throw error;
    }
);



export { $host, $authHost, $api };
