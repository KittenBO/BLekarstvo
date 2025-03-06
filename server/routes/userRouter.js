import { Router } from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { body } from "express-validator";

export const userRouter = new Router();

userRouter.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    userController.registration );
userRouter.post('/login', userController.login );
userRouter.post('/logout', userController.logout );
userRouter.get('/activate/:link', userController.activate )
userRouter.get('/auth', userController.refresh )
userRouter.get('/users', authMiddleware, userController.getUsers )
