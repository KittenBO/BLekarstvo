import { Router } from 'express';
import HistoryController from '../controllers/historyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

export const historyRouter = new Router();

historyRouter.get('/', authMiddleware, HistoryController.getHistory);
historyRouter.post('/', authMiddleware, HistoryController.addToHistory);
