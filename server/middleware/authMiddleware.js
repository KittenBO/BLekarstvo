import { ApiError } from "../error/apiError.js"
import tokenService from "../service/tokenService.js"

export default function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }
    try{
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            next(ApiError.notAuthorized('Не авторизован'))
        }
        const userData = tokenService.validateAccessToken(token);
        if (!userData) {
            next(ApiError.notAuthorized('Не корректный токен'))
        }
        req.user = userData;
        next()

    } catch(e) {
        next(ApiError.notAuthorized('Не авторизован'))
    }
}