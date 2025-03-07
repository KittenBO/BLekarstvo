import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import { Brand } from '../models/models.js';
import { Type } from '../models/models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BrandTypeService {
    async createBrand(name, img) {
        let FileName = uuidv4() + '.jpg';
        img.mv(path.resolve(__dirname, '..', 'static', FileName));
        const brand = await Brand.create( {name, img: FileName} );
        return brand;
    }

    async createType(name) {
        const type = await Type.create({name});
        return type;
    }

    async getAllBrands() {
        const brands = await Brand.findAll();
        return brands;
    }

    async getAllTypes() {
        const types = await Type.findAll();
        return types;
    }
}

export default new BrandTypeService();