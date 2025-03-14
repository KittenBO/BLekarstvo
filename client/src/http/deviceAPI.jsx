import { $api } from './index';

export const createType = async (type) => {
    const { data } = await $api.post('api/type', type);
    return data;
}

export const fetchTypes = async () => {
    const { data } = await $api.get('api/type');
    return data;
}
export const deleteType = async (id) => {
    const { data } = await $api.delete('api/type/' + id);
    return data;
}
export const createBrand = async (brand) => {
    const { data } = await $api.post('api/brand', brand);
    return data;
}

export const fetchBrands = async () => {
    const { data } = await $api.get('api/brand');
    return data;
}
export const deleteBrand = async (id) => {
    const { data } = await $api.delete('api/brand/' + id);
    return data;
}

export const createDevice = async (device) => {
    const { data } = await $api.post('api/device', device);
    return data;
}
export const deleteDevice = async (id) => {
    const { data } = await $api.delete('api/device/' + id);
    return data;
}
export const putDevice = async (id, params) => {
    const { data } = await $api.put(`api/device/${id}`, params);
    return data;
}

export const fetchDevices = async (typeId, brandId, page, limit = 5) => {
    const { data } = await $api.get('api/device', {params: {
        typeId, brandId, page, limit
    }});
    return data;
}

export const fetchOneDevice = async (id) => {
    const { data } = await $api.get('api/device/' + id);
    return data;
}

