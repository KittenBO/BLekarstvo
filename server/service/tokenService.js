import jwt  from 'jsonwebtoken';
import { Token } from '../models/models.js';

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign({data: payload}, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'}); 
        const refreshToken = jwt.sign({data: payload}, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        } 
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({userId});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await Token.create({userId, refreshToken});
        return token; 
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.destroy({where: {refreshToken}});
        return tokenData;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch {
            return null;
        }
    }

    async findToken(refreshToken) {
        try {
            const tokenData = await Token.findOne({ refreshToken });
            return tokenData;
        } catch(e) {
            return null;
        }
    }
}

export default new TokenService();