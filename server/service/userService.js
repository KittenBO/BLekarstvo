import bcryp from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { User, Basket } from "../models/models.js";
import mailService from "../service/mailService.js";
import tokenService from "../service/tokenService.js";
import userDto from "../dtos/userDto.js";
import { ApiError } from "../error/apiError.js";

class UserService {
    async registration(email, password) {
        if (!email || !password) {
            throw new Error('Данные не введены')
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            throw new Error(`Пользователь с таким email ${email} уже существует`)
        }
        const hashPassword = await bcryp.hash(password, 5);
        const activationLink = uuidv4();
        const user = await User.create({email, password: hashPassword, activationLink});
        const basket = await Basket.create({userId: user.id});
        await mailService.sendActivationLink(email, `${process.env.API_URL}api/user/activate/${activationLink}`);

        const userDTO = new userDto(user);
        const tokens = tokenService.generateToken({...userDTO});
        await tokenService.saveToken(userDTO.id, tokens.refreshToken);

        return {...tokens, user: userDTO}
    }

    async activate(activationLink) {
        const user = await User.findOne({where: {activationLink}})
        if (!user) {
            throw new Error('Ошибка. Ссылка не корректна.')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await User.findOne({where: {email}})
        if (!user) {
            throw new Error('Пользователь с таким email не существует')
        }
        let comparePassword = bcryp.compareSync(password, user.password);
        if (!comparePassword) {
            throw new Error('Неверный логин или пароль')
        }
        const userDTO = new userDto(user);
        const tokens = tokenService.generateToken({...userDTO});
        await tokenService.saveToken(userDTO.id, tokens.refreshToken);

        return {...tokens, user: userDTO}
    }
    
    async logout(RefreshToken) {
        const token = await tokenService.removeToken(RefreshToken);
        return token;
    }

    async refresh(refreshToken) {
        try {
            if (!refreshToken) {
                throw ApiError.notAuthorized('Пользователь не авторизован')
            }
            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDB = await tokenService.findToken(refreshToken);
            if (!userData || !tokenFromDB) {
                throw ApiError.notAuthorized('Невалидный токен или токен не найден');
            }
            const user = await User.findByPk(userData.data.id);
            if (!user) {
                throw ApiError.notAuthorized('Пользователь не найден');
            }
            const userDTO = new userDto(user);
            const tokens = tokenService.generateToken({...userDTO});
            await tokenService.saveToken(userDTO.id, tokens.refreshToken);
    
            return {...tokens, user: userDTO}
        } catch(error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const users = await User.findAll()
            return users;
        } catch(error) {
            throw error;
        }
    }
    
}

export default new UserService();