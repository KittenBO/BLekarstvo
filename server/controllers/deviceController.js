import { ApiError } from "../error/apiError.js";
import deviceSerivce from '../service/deviceSerivce.js';


class deviceController {
    async create(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body;
            if(!req.files || !req.files.img) {
                return next(ApiError.badRequest('Не вставленно изображение'));
            }
            const { img } = req.files;
            if (!name || !price || !brandId || !typeId) {
                return next(ApiError.badRequest('Обязательные для заполнения данные не указанны'));
            } 
            const device = await deviceSerivce.createDevice(name, price, brandId, typeId, info, img)
            return res.json({ message: 'Успешно.' });
        } catch (e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    }

    async getAll(req, res, next) {
        try {
            let {brandId, typeId, limit, page} = req.query;
            const devices = await deviceSerivce.getAllDevices(brandId, typeId, limit, page);
            return res.json(devices);
        } catch (e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return next(ApiError.badRequest('Страница не найдена. Попробуйте позже'));
            }
            const device = await deviceSerivce.getOneDevice(id);
            res.json(device);
        } catch(e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params; 
            if (!id) {
                return next(ApiError.badRequest('Страница не найдена. Попробуйте позже'));
            }
            await deviceSerivce.deleteDevice(id);
            return res.json({ message: 'Препарат успешно удален' });
        } catch (e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    }

    async put(req, res, next) {
        try {
            const { id } = req.params;
            const { name, price, brandId, typeId, info } = req.body;
            if (!name || !price || !brandId || !typeId) {
                return next(ApiError.badRequest('Обязательные для заполнения данные не указанны'));
            }
            if (!id) {
                return next(ApiError.badRequest('Страница не найдена. Попробуйте позже'));
            }
            await deviceSerivce.putDevice(id, name, price, brandId, typeId, info, req);
            return res.json({ message: 'Данные о препарате успешно обновлены' });
        } catch (e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    }
    
}

export default new deviceController();