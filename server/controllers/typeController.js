import { ApiError } from '../error/apiError.js';
import brandTypeService from '../service/brandTypeService.js';
class typeController {
    async create(req, res, next) {
        try {
            const {name} = req.body;
            if (!name) {
                return next(ApiError.badRequest('Название не указанно'));
            } 
            const type = await brandTypeService.createType(name);
            return res.json(type);
        } catch(e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    }

    async getAll(req, res) {
        try {
            const types = await brandTypeService.getAllTypes();
            return res.json(types);
        } catch(e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    }
}

export default new typeController();