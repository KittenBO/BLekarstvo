import { Brand } from '../models/models.js';
import { ApiError } from '../error/apiError.js';

class brandController {
    async create(req, res) {
        const {name} = req.body;
        const brand = await Brand.create({name});
        return res.json(brand);
    }

    async getAll(req, res) {
        const brands = await Brand.find();
        return res.json(brands);
    }
}

export default new brandController();