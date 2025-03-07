import { Basket, User } from "../models/models.js";
import { ApiError } from "../error/apiError.js";
import basketService from "../service/basketService.js";

class BasketController {
    async getBasket(req, res, next) {
        try {
            const userId = req.user.data.id;
            const basket = await Basket.findOne({ where: { userId } });
            if (!userId) {
                return next(ApiError.badRequest('Пользователь не зарегистрирован'));
            }
            if (!basket) {
                return next(ApiError.badRequest('Корзина не найдена'));
            }
            const devices = await basketService.getOneBasket(basket);
            return res.json(devices);
        } catch(e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }   
    }

    async addToBasket(req, res, next) {
        try {
            const userId = req.user.data.id;
            const { deviceId, quantity } = req.body;
            const user = await User.findOne({ where: { id: userId } });
            if (!user.isActivated) {
                return next(ApiError.badRequest('Для этого вам необходимо подтвердить свой аккаунт.'));
            }
            if (!userId) {
                return next(ApiError.badRequest('Пользователь не зарегистрирован'));
            }
            if (!deviceId || !quantity) {
                return next(ApiError.notFound('Ошибка сервера. Попробуйте позже.'));
            }
            await basketService.addToBasket(userId, deviceId, quantity);
            return res.json({ message: 'Препарат добавлен в корзину' });
        } catch(e) {
            return next(ApiError.internal(e));
        }
    }

    async removeFromBasket(req, res, next) {
        try {
            const userId = req.user.data.id;
            const { deviceId } = req.body;
            if (!userId) {
                return next(ApiError.badRequest('Пользователь не зарегистрирован'));
            }
            if (!deviceId) {
                return next(ApiError.notFound('Ошибка сервера. Попробуйте позже.'));
            }
            await basketService.removeFromBasket(userId, deviceId);
            return res.json({ message: 'Препарат удален из корзины' });
        } catch(e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    }    

    async clearBasket(req, res, next) {
        try {
            const userId = req.user.data.id;
            if (!userId) {
                return next(ApiError.badRequest('Пользователь не зарегистрирован'));
            }
            await basketService.clearOneBasket(userId);
            return res.json({ message: 'Корзина очищена' });
        } catch(e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    }
    
    async updateBasketItem(req, res) {
        try {
            const userId = req.user.data.id;
            const { deviceId, quantity } = req.body;
            if (!userId) {
                return next(ApiError.badRequest('Пользователь не зарегистрирован'));
            }
            if (!deviceId || !quantity) {
                return next(ApiError.notFound('Ошибка сервера. Попробуйте позже.'));
            }
            await basketService.updateBasketItem(userId, deviceId, quantity);
            return res.json({ message: 'Количество обновлено' });
        } catch(e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    }
    
}

export default new BasketController();
