import { Router } from "express";
import typeController from "../controllers/typeController.js";
import checkRole from "../middleware/checkRoleMiddleware.js";
export const typeRouter = new Router();

typeRouter.post('/', checkRole('ADMIN'), typeController.create )
typeRouter.delete('/:id', checkRole('ADMIN'), typeController.delete )
typeRouter.get('/', typeController.getAll )