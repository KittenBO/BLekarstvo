import { Router } from "express";
import RatingController from '../controllers/ratingController.js';
export const ratingRouter = new Router();

ratingRouter.post('/', RatingController.addRating);

