import { Router } from "express";
import RatingController from '../controllers/ratingController.js';
import checkRole from "../middleware/checkRoleMiddleware.js";
export const ratingRouter = new Router();

ratingRouter.post('/', checkRole('ADMIN'), RatingController.addRating);

