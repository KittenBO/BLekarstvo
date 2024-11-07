import { ApiError } from "../error/apiError.js"
import jwt from 'jsonwebtoken'

export default function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }
    try{
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            next(ApiError.notAuthorized('Не авторизован'))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()

    } catch(e) {
        next(ApiError.notAuthorized('Не авторизован'))
    }
}