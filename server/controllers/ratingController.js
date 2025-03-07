import { Rating, Device, User } from '../models/models.js';
import { ApiError } from "../error/apiError.js";

class RatingController {
    async addRating(req, res, next) {
        try {
            const { deviceId, rate, userId } = req.body;
            if (!deviceId || !rate || rate < 1 || rate > 5) {
                return next(ApiError.badRequest('Обязательные для заполнения данные не указанны'));
            }
            const existingRating = await Rating.findOne({ where: { deviceId, userId } });

            const user = await User.findByPk(userId);
            if (existingRating && user.role !== "ADMIN") {
                return next(ApiError.badRequest('Вы уже оставили рейтинг для этого устройства.'));
            }

            const newRating = await Rating.create({ deviceId, rate, userId });

            const ratings = await Rating.findAll({ where: { deviceId } });
            const averageRate = Math.round(ratings.reduce((sum, r) => sum + r.rate, 0) / ratings.length);

            const device = await Device.findByPk(deviceId);
            if (!device) {
                return next(ApiError.badRequest('Устройство не найдено.'));
            }
            device.rating = averageRate;
            await device.save();

            return res.json({ message: 'Успешно.' });
        } catch (e) {
            return next(ApiError.internal('Непредвиденная ошибка. Попробуйте позже'));
        }
    }
}

export default new RatingController();
