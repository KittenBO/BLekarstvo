import { Router } from "express";
import typeController from "../controllers/typeController.js";
import checkRole from "../middleware/checkRoleMiddleware.js";
export const typeRouter = new Router();

typeRouter.post('/', checkRole('ADMIN'), typeController.create )
typeRouter.get('/', typeController.getAll )