import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {};
        this._role= "";
        this._isLoading = false;
        this._isActivated = false;
        makeAutoObservable(this);
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setUser(user) {
        this._user = user;
    }

    setRole(role) {
        this._role = role;
    }
    setLoading(bool) {
        this._isLoading = bool;
    }
    setIsActivated(bool) {
        this._isActivated = bool;
    }

    get isAuth() {
        return this._isAuth;
    }
    get user() {
        return this._user;
    }
    get role() {
        return this._role;
    }
    get isLoading() {
        return this._isLoading;
    }
    get isActivated() {
        return this._isActivated
    }

    async login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken); // Исправлено
            this.setIsAuth(true);
            this.setUser(response.data.user);
            this.setRole(response.data.user.role);
            this.setIsActivated(response.data.user.isActivated);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }
    
    async registration(email, password) {
        try {
            const response = await AuthService.registration(email, password);
            localStorage.setItem('token', response.data.accessToken); // Исправлено
            this.setIsAuth(true);
            this.setUser(response.data.user);
            this.setRole(response.data.user.role);
            this.setIsActivated(response.data.user.isActivated);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }    

    async logout() {
        try {
            const responce = await AuthService.logout();
            localStorage.removeItem('token');
            this.setIsAuth(false);
            this.setUser({});
        } catch(e) {
            console.log(e.response?.data?.message);
        }
    }

    async check() {
        this.setLoading(true);
        try {
            const responce = await axios.get(`${import.meta.env.VITE_API_URL }api/user/auth`, {withCredentials: true});
            console.log(responce)
            localStorage.setItem('token', responce.data.accessToken);
            this.setIsAuth(true);
            this.setUser(responce.data.user);
            this.setRole(responce.data.user.role);
            this.setIsActivated(responce.data.user.isActivated);
        } catch(e) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}