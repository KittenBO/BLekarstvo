import { ApiError } from "../error/apiError.js"
import tokenService from "../service/tokenService.js"

export default function (role) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }
        try{
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                next(ApiError.notAuthorized('Не авторизован'))
            }
            const decoded = tokenService.validateAccessToken(token);
            if (decoded.data.role !== role) {
                next(ApiError.forbidden('Недостаточно прав'))
            }
            req.user = decoded
            next()
    
        } catch(e) {
            next(ApiError.notAuthorized('Не авторизован'))
        }
    }
}