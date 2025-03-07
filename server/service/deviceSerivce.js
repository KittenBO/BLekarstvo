import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Device, DeviceInfo } from "../models/models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class DeviceService {
    async createDevice(name, price, brandId, typeId, info, img) {
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
    }

    async getAllDevices(brandId, typeId, limit, page) {
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;
        let devices;
        if (!brandId && !typeId) {
            return devices = await Device.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            return devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            return devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
        }
        if (brandId && typeId) {
            return devices = await Device.findAndCountAll({where: {typeId, brandId}, limit, offset})
        }
    }

    async getOneDevice(id) {
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            }
        );
        return device;
    }

    async deleteDevice(id) {
        const device = await Device.findOne({ where: { id } });
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
        return;        
    }

    async putDevice(id, name, price, brandId, typeId, info, req) {
        const device = await Device.findOne({ where: { id } });
        let imgPath = device.img;
        if (req.files && req.files.img) {
            const img = req.files.img; 
            imgPath = uuidv4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', imgPath));
        }
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
    }
}

export default new DeviceService();