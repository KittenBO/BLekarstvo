import { $authHost } from './index';

export const getHistory = async () => {
    const { data } = await $authHost.get('api/history');
    return data;
}

export const addToHistory = async (deviceId, quantity, totalPrice, status) => {
    const { data } = await $authHost.post('api/history', { deviceId, quantity, totalPrice, status });
    return data;
};

