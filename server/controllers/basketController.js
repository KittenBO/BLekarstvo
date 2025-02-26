import { Basket, BasketDevice, Device } from "../models/models.js";
import { ApiError } from "../error/apiError.js";

class BasketController {
    async getBasket(req, res) {
        const userId = req.user.id;
        const basket = await Basket.findOne({ where: { userId } });
        
        if (!basket) {
            return res.json({ devices: [] });
        }

        const devices = await BasketDevice.findAll({
            where: { basketId: basket.id },
            include: [{ model: Device }]
        });

        return res.json(devices);
    }

    async addToBasket(req, res) {
        const userId = req.user.id;
        const { deviceId, quantity } = req.body;

        const device = await Device.findOne({ where: { id: deviceId } });
        if (!device) {
            return res.status(404).json({ message: 'Устройство не найдено' });
        }

        let basket = await Basket.findOne({ where: { userId } });

        if (!basket) {
            basket = await Basket.create({ userId });
        }

        const basketDevice = await BasketDevice.findOne({
            where: {
                basketId: basket.id,
                deviceId
            }
        });

        if (basketDevice) {
            basketDevice.quantity += quantity;
            await basketDevice.save();
        } else {
            await BasketDevice.create({ basketId: basket.id, deviceId, quantity });
        }
        
        return res.json({ message: 'Устройство добавлено в корзину' });
    }

    async removeFromBasket(req, res) {
        const userId = req.user.id;
        const { deviceId } = req.body;
    
        const basket = await Basket.findOne({ where: { userId } });
    
        if (!basket) {
            return res.status(404).json({ message: 'Корзина не найдена' });
        }
    
        const basketDevice = await BasketDevice.findOne({
            where: {
                basketId: basket.id,
                deviceId
            }
        });
    
        if (basketDevice) {
            await BasketDevice.destroy({ where: { id: basketDevice.id } });
            return res.json({ message: 'Устройство полностью удалено из корзины' });
        }
    
        return res.status(404).json({ message: 'Устройство не найдено в корзине' });
    }    

    async clearBasket(req, res) {
        const userId = req.user.id;
        const basket = await Basket.findOne({ where: { userId } });

        if (basket) {
            await BasketDevice.destroy({ where: { basketId: basket.id } });
            return res.json({ message: 'Корзина очищена' });
        }

        return next(ApiError.badRequest('Корзина не найдена'));
    }
    
    async updateBasketItem(req, res) {
        const userId = req.user.id;
        const { deviceId, quantity } = req.body;
    
        const basket = await Basket.findOne({ where: { userId } });
    
        if (!basket) {
            return res.status(404).json({ message: 'Корзина не найдена' });
        }
    
        const basketDevice = await BasketDevice.findOne({
            where: {
                basketId: basket.id,
                deviceId
            }
        });
    
        if (basketDevice) {
            if (quantity <= 0) {
                await BasketDevice.destroy({ where: { id: basketDevice.id } });
                return res.json({ message: 'Устройство удалено из корзины' });
            }
    
            basketDevice.quantity = quantity;
            await basketDevice.save();
            return res.json({ message: 'Количество обновлено' });
        }
    
        return res.status(404).json({ message: 'Устройство не найдено в корзине' });
    }
    
}

export default new BasketController();
