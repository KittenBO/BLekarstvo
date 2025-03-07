import { ApiError } from '../error/apiError.js';
import historyService from '../service/historyService.js';

class HistoryController {
    async getHistory(req, res, next) {
        try {
            const userId = req.user.data.id;
            if (!userId) {
                return next(ApiError.notAuthorized('Пользователь не авторизован.'));
            }
            const orders = await historyService.getHistory(userId)
            if (orders.length === 0) {
                return res.status(204).json({ message: 'Нет данных о истории заказов.' });
            }
            return res.json(orders);
        } catch (e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    };
    
    
    async addToHistory (req, res, next) {
        try {
            const { deviceId, quantity, totalPrice, status } = req.body;
            const userId = req.user.data.id;
    
            if (!deviceId || !quantity || !totalPrice || !status) {
                return next(ApiError.badRequest('Неверно введены данные.'));
            }
            await historyService.addToHistory(userId, deviceId, quantity, totalPrice, status);
            return res.json({ message: 'Успешно.' });
        } catch (e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    };
}

export default new HistoryController();