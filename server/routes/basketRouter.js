import { Router } from 'express';
import BasketController from '../controllers/basketController.js';
import authMiddleware from '../middleware/authMiddleware.js';

export const basketRouter = new Router();

basketRouter.get('/', authMiddleware, BasketController.getBasket);
basketRouter.post('/', authMiddleware, BasketController.addToBasket);
basketRouter.delete('/', authMiddleware, BasketController.removeFromBasket);
basketRouter.delete('/clear', authMiddleware, BasketController.clearBasket);
basketRouter.put('/update', authMiddleware, BasketController.updateBasketItem);

