import { Basket, BasketDevice, Device } from "../models/models.js";
import { ApiError } from "../error/apiError.js";

class BasketService {
    async getOneBasket(basket) {
        const devices = await BasketDevice.findAll({
            where: { basketId: basket.id },
            include: [{ model: Device }]
        });   
        return devices;
    }

    async addToBasket(userId, deviceId, quantity) {
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
        return;
    }

    async removeFromBasket(userId, deviceId) {
        const basket = await Basket.findOne({ where: { userId } });
        const basketDevice = await BasketDevice.findOne({
            where: {
                basketId: basket.id,
                deviceId
            }
        });
    
        if (basketDevice) {
            return await BasketDevice.destroy({ where: { id: basketDevice.id } });
        }
        throw ApiError.notFound('Устройство не найдено в корзине');
    }

    async clearOneBasket(userId) {
        const basket = await Basket.findOne({ where: { userId } });
        if (basket) {
            return await BasketDevice.destroy({ where: { basketId: basket.id } });
        }
        throw ApiError.notFound('Корзина не найдена');
    }

    async updateBasketItem(userId, deviceId, quantity) {
        const basket = await Basket.findOne({ where: { userId } });
        if (!basket) {
            throw ApiError.notFound('Корзина не найдена');
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
            return await basketDevice.save();
        }
        throw ApiError.notFound('Устройство не найдено в корзине');
    }
}

export default new BasketService();