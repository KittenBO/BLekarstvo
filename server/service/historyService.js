import { OrderHistory } from '../models/models.js';

class HistoryService {
    async getHistory(userId) {
        const orders = await OrderHistory.findAll({ where: { userId } });
        return orders;
    }

    async addToHistory(userId, deviceId, quantity, totalPrice, status) {
        const newOrder = await OrderHistory.create({ userId, deviceId, quantity, totalPrice, status });
        return newOrder;
    }
}

export default new HistoryService();