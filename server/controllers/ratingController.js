import { Rating } from '../models/models.js';

class RatingController {
    async addRating(req, res) {
        const { deviceId, rate, userId } = req.body;

        if (!deviceId || !rate || rate < 1 || rate > 5) {
            return res.status(400).json({ message: 'Неверные данные' });
        }

        try {
            const newRating = await Rating.create({ deviceId, rate, userId });
            return res.status(201).json({ message: 'Рейтинг добавлен', rating: newRating });
        } catch (error) {
            return res.status(500).json({ message: 'Ошибка при добавлении рейтинга', error });
        }
    }
}

export default new RatingController();
