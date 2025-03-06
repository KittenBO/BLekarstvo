import { $host } from './index';
import { jwtDecode } from 'jwt-decode';

export const registration = async (email, password) => {
    const { data } = await $host.post('api/user/registration', { email, password });
    localStorage.setItem('token', data.Refreshtoken);
    return jwtDecode(data.token);
}

export const login = async (email, password) => {
    try {
        const { data } = await $host.post('api/user/login', { email, password });
        localStorage.setItem('token', data.accessToken);
        return jwtDecode(data.accessToken);
    } catch (error) {
        console.error('Ошибка при логине:', error);
        throw error;
    }
}


export const check = async () => {
    try {
        const responce  = await $host.get('api/user/auth', {withCredentials: true})
        localStorage.setItem('token', responce.accessToken);
        return jwtDecode(responce.accessToken);
    } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        throw error;
    }
}

export const l = async () => {
    try {
        const responce  = await $host.get('api/user/auth', {withCredentials: true})
        localStorage.setItem('token', responce.accessToken);
        return jwtDecode(responce.accessToken);
    } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        throw error;
    }
}

