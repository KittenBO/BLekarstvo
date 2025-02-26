import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Device, DeviceInfo } from "../models/models.js";
import { ApiError } from "../error/apiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class deviceController {
    async create(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body;
            const { img } = req.files;
            let FileName = uuidv4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', FileName));

            const device = await Device.create({ name, price, brandId, typeId, img: FileName });

            if (info) {
                info = JSON.parse(info);
                info.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                });
            }

            return res.json(device);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;
        let devices;
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId, brandId}, limit, offset})
        }
        return res.json(devices);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            }
        );
        res.json(device);
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params; 
            const device = await Device.findOne({ where: { id } });

            if (!device) {
                return next(ApiError.badRequest('Устройство не найдено'));
            }

            const imgPath = path.resolve(__dirname, '..', 'static', device.img);

            fs.unlink(imgPath, (err) => {
                if (err) {
                    console.error('Ошибка при удалении изображения:', err);
                }
            });

            await Device.destroy({
                where: { id }
            });

            await DeviceInfo.destroy({ where: { deviceId: id } });

            return res.json({ message: 'Устройство успешно удалено' });
        } catch (e) {
            console.error(e);
            next(ApiError.internal(e.message));
        }
    }

    async put(req, res, next) {
        try {
            const { id } = req.params;
            const { name, price, brandId, typeId, info } = req.body;
    
            const device = await Device.findOne({ where: { id } });
            if (!device) {
                return next(ApiError.badRequest('Устройство не найдено'));
            }
            let imgPath = device.img;
            if (req.files && req.files.img) {
                const img = req.files.img; 
                imgPath = uuidv4() + '.jpg';
                img.mv(path.resolve(__dirname, '..', 'static', imgPath));
            }
    
            // Обновляем устройство с новыми данными
            await Device.update({ name, price, brandId, typeId, img: imgPath }, { where: { id } });
    
            if (info) {
                const parsedInfo = JSON.parse(info);
                await DeviceInfo.destroy({ where: { deviceId: id } });
                
                parsedInfo.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: id
                    });
                });
            }
    
            return res.json({ message: 'Устройство успешно обновлено' });
        } catch (e) {
            console.error(e);
            next(ApiError.internal(e.message));
        }
    }
    
}

export default new deviceController();