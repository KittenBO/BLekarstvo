import { Router } from "express";
import brandController from "../controllers/brandController.js";
import checkRole from "../middleware/checkRoleMiddleware.js";

export const brandRouter = new Router();

brandRouter.post('/', checkRole('ADMIN'), brandController.create )
brandRouter.get('/', brandController.getAll )