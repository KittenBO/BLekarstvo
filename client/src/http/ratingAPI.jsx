import { $api } from './index';

export const addRating = async (deviceId, rate, userId) => {
    const { data } = await $api.post('api/rating', { deviceId, rate, userId });
    return data;
};
