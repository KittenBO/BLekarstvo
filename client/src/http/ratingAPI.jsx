import { $authHost } from './index';

export const addRating = async (deviceId, rate, userId) => {
    const { data } = await $authHost.post('api/rating', { deviceId, rate, userId });
    return data;
};