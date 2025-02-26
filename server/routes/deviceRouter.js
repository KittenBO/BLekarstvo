import { Router } from "express";
import deviceController from "../controllers/deviceController.js";
import checkRole from "../middleware/checkRoleMiddleware.js";
export const deviceRouter = new Router();

deviceRouter.post('/', checkRole('ADMIN'), deviceController.create )
deviceRouter.get('/', deviceController.getAll )
deviceRouter.get('/:id', deviceController.getOne )
deviceRouter.delete('/:id', checkRole('ADMIN'), deviceController.delete);
deviceRouter.put('/:id', checkRole('ADMIN'), deviceController.put);
