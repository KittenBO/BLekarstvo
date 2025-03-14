import { ApiError } from "../error/apiError.js";
import userService from "../service/userService.js";
import { validationResult } from "express-validator";

class userController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Некорректный email или пароль слишком мал(менее 6 символов)'))
            }
            const {email, password } = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('RefreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true});

            return res.json(userData);
        } catch(error){
            return next(ApiError.internal(`${error}`))
        }
    }

    async activate(req, res, next) {
        try{
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch(error){
            return next(ApiError.internal(`${error}`))
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(ApiError.badRequest('Не введен email или пароль.'));
            }
            const userData = await userService.login(email, password);
            res.cookie('RefreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        } catch (error) {
            return next(ApiError.internal(`${error}`));
        }
    }
    

    async logout(req, res, next) {
        try {
            const { RefreshToken } = req.cookies;
            const token = await userService.logout(RefreshToken);
            res.clearCookie('RefreshToken');
            return res.json(token);
        } catch(error) {
            return next(ApiError.internal(`${error}`)) 
        }

    }

    async refresh(req, res, next) {
       try {
            const { RefreshToken } = req.cookies;
            const userData = await userService.refresh(RefreshToken);
            res.cookie('RefreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true});
            return res.json(userData);
        } catch(error) {
            return next(ApiError.internal(`${error}`)) 
        } 
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users)
        } catch(error) {
            return next(ApiError.internal(`${error}`)) 
        }
    }

}

export default new userController();