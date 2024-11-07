import { ApiError } from "../error/apiError.js";
import bcryp from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Basket } from "../models/models.js";


const generateJWT = (id, email, role) => {
    return jwt.sign({id, email: email, role},
        process.env.JWT_SECRET,
        {expiresIn: '24h'}
    );
}
class userController {
    async registration(req, res, next) {
        const {email, password, role} = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest('Не задан email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcryp.hash(password, 5);
        const user = await User.create({email, role, password: hashPassword});
        const basket = await Basket.create({userId: user.id});
        const token = generateJWT(user.id, user.email, user.role);
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if (!user) {
            return next(ApiError.internal('Пользователь с таким email не существует'))
        }
        let comparePassword = bcryp.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Неверный email или пароль'))
        }
        const token = generateJWT(user.id, user.email, user.role);
        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJWT(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

export default new userController();