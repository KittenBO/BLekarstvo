import { $api } from './index';

export const getHistory = async () => {
    const { data } = await $api.get('api/history');
    return data;
}

export const addToHistory = async (deviceId, quantity, totalPrice, status) => {
    const { data } = await $api.post('api/history', { deviceId, quantity, totalPrice, status });
    return data;
};

