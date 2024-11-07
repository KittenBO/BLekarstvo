import { MdLocalPharmacy } from 'react-icons/md';
import { NavLink, useLocation } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/const';

export default function Auth() {

    const location = useLocation();
    const isLogin = location.pathname === LOGIN_ROUTE

    return (
        <>
        {isLogin ?
            <div className="flex justify-center items-center mt-40">
            <div className="bg-amber-50 text-orange-600 shadow-lg rounded-lg w-full max-w-md p-8">
                <div className="text-xl sm:text-3xl mb-6 mt-8 text-center font-thin">
                    <MdLocalPharmacy className='inline-block mx-1 -mt-1' />БЛекарство
                </div>
                <div>
                    <label htmlFor="login" className="block font-medium mb-2">
                        Войти
                    </label>
                    <input
                        type="text"
                        id="login"
                        className="w-full border border-gray-300 rounded-lg py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                        placeholder="Телефон, E-mail или Ник"
                    />
                    <label htmlFor="password" className="block font-medium mb-2">
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full border border-gray-300 rounded-lg py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                        placeholder="Введите пароль"
                    />
                    <button className="bg-amber-200 font-medium py-2 px-4 rounded-lg shadow-md w-full">
                        Войти
                    </button>
                </div>
                <div className="w-full text-center mt-4 text-sm hover:text-secondary">
                    <NavLink to={REGISTRATION_ROUTE}>Забыли пароль? Восстановление пароля</NavLink>
                </div>
                <div className="w-full text-center text-sm hover:text-secondary">
                    <NavLink to={REGISTRATION_ROUTE}>Нет аккаунта? Зарегистрироваться</NavLink>
                </div>
            </div>
            </div>
            :
            <div className="flex justify-center items-center mt-40">
            <div className="bg-amber-50 text-orange-600 shadow-lg rounded-lg w-full max-w-md p-8">
                <div className="text-xl sm:text-3xl mb-6 mt-8 text-center font-thin">
                    <MdLocalPharmacy className='inline-block mx-1 -mt-1' />БЛекарство
                </div>
                <div>
                    <label htmlFor="login" className="block font-medium mb-2">
                        Регистрация
                    </label>
                    <input
                        type="text"
                        id="login"
                        className="w-full border border-gray-300 rounded-lg py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                        placeholder="Телефон, E-mail или Ник"
                    />
                    <label htmlFor="password" className="block font-medium mb-2">
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full border border-gray-300 rounded-lg py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                        placeholder="Введите пароль"
                    />
                    <button className="bg-amber-200 font-medium py-2 px-4 rounded-lg shadow-md w-full">
                        Зарегистрироваться
                    </button>
                </div>
                <div className="w-full text-center mt-4 text-sm hover:text-secondary">
                    <NavLink to={REGISTRATION_ROUTE}>Забыли пароль? Восстановление пароля</NavLink>
                </div>
                <div className="w-full text-center text-sm hover:text-secondary">
                    <NavLink to={LOGIN_ROUTE}>У вас уже есть аккаунт? Войти</NavLink>
                </div>
            </div>
            </div>
        }
        </>
    );
}
