import { ApiError } from '../error/apiError.js';
import brandTypeService from '../service/brandTypeService.js';

class brandController {
    async create(req, res, next) {
        try {
            const { name } = req.body;
            if(!req.files || !req.files.img) {
                return next(ApiError.badRequest('Не вставленно изображение'));
            }
            const { img } = req.files;
            if (!name) {
                return next(ApiError.badRequest('Название не указанно'));
            }        
            const brand = await brandTypeService.createBrand(name, img);
            return res.json(brand);
        } catch (e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        } 
    }

    async getAll(req, res) {
        try {
            const brands = await brandTypeService.getAllBrands();
            return res.json(brands);
        } catch(e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    }
}

export default new brandController();