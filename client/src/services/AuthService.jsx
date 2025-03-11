import { $api } from "../http/index";
export default class AuthService {
    static async login(email, password) {
        return $api.post('api/user/login', { email, password });
    }

    static async registration(email, password) {
        return $api.post('api/user/registration', { email, password });
    }

    static async logout() {
        return $api.post('api/user/logout');
    }
}
