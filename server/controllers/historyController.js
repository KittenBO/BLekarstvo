import { OrderHistory } from '../models/models.js';
import { ApiError } from '../error/apiError.js';

class HistoryController {
    async getHistory(req, res, next) {
        try {
            const userId = req.user.id;
            if (!userId) {
                return next(ApiError.unauthorized('Пользователь не авторизован.'));
            }
    
            const orders = await OrderHistory.findAll({ where: { userId } });
            if (orders.length === 0) {
                return res.status(204).json({ message: 'Нет данных' });
            }
            res.json(orders);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    };
    
    
    async addToHistory (req, res, next) {
        try {
            const { deviceId, quantity, totalPrice, status } = req.body;
            const userId = req.user.id;
    
            if (!deviceId || !quantity || !totalPrice || !status) {
                return next(ApiError.badRequest('Неверно введены данные.'));
            }
    
            const newOrder = await OrderHistory.create({ userId, deviceId, quantity, totalPrice, status });
            res.status(201).json(newOrder);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    };
}

export default new HistoryController();