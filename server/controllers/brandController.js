import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import { Brand } from '../models/models.js';
import { ApiError } from '../error/apiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class brandController {
    async create(req, res, next) {
        try {
            const { name } = req.body;
            const { img } = req.files;

            let FileName = uuidv4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', FileName));

            const brand = await Brand.create( {name, img: FileName} );
            return res.json(brand);
        } catch(e) {
            next(ApiError.internal(e.message));
        }
    }

    async getAll(req, res) {
        const brands = await Brand.findAll();
        return res.json(brands);
    }
}

export default new brandController();