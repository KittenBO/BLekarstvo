import { $api } from './index';

export const getBasket = async () => {
    const { data } = await $api.get('api/basket');
    return data;
}

export const addToBasket = async (deviceId, quantity) => {
    const { data } = await $api.post('api/basket', { deviceId, quantity });
    return data;
};

export const removeFromBasket = async (deviceId) => {
    const { data } = await $api.delete('api/basket',  { data: { deviceId } });
    return data;
}

export const clearBasket = async () => {
    const { data } = await $api.delete('api/basket/clear');
    return data;
}

export const updateBasketItem = async (deviceId, quantity) => {
    const { data } = await $api.put(`api/basket/update`, { deviceId, quantity });
    return data;
};

