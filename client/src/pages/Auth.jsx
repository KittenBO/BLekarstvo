import { MdLocalPharmacy } from 'react-icons/md';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from 'react';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from '../utils/const';
import Tooltip from '../components/ToolTip';
import { observer } from 'mobx-react-lite';
import { Context } from '../main';

const Auth = observer(() => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState('');

    const { user } = useContext(Context);

    const click = async () => {
        let data;
        try {
            if (isLogin) {
                data = await user.login(email, password);
            } else {
                if (password !== confirmPassword) {
                    setTooltipMessage('Пароли не совпадают!');
                    setTooltipVisible(true);
                    return;
                }
                data = await user.registration(email, password)
                setTooltipMessage('Проверьте вашу почту для подтверждения.');
            }
            navigate(SHOP_ROUTE);
             
        } catch (e) {
            setTooltipMessage(`Произошла ошибка. Попробуйте позже.`);
            setTooltipVisible(true);
        }
    };

    return (
        <>
        {tooltipVisible && (
            <Tooltip 
                message={tooltipMessage} 
                duration={3000} 
                onClose={() => setTooltipVisible(false)} 
            />
        )}
        {isLogin ?
            <div className="flex justify-center items-center mt-40">
                <div className="bg-amber-50 text-orange-600 shadow-lg rounded-lg w-full max-w-md p-8">
                    <div className="text-xl sm:text-3xl mb-6 mt-8 text-center font-thin">
                        <MdLocalPharmacy className='inline-block mx-1 -mt-1' />БЛекарство
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Войти</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                            placeholder="Телефон, E-mail или Ник"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <label className="block font-medium mb-2">Пароль</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button 
                            className="bg-amber-200 font-medium py-2 px-4 rounded-lg shadow-md w-full"
                            onClick={click}
                        >
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
                        <label className="block font-medium mb=2">Регистрация</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                            placeholder="E-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <label className="block font-medium mb=2">Пароль</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <label className="block font-medium mb=2">Повторите пароль</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                            placeholder="Повторите пароль"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                        <button 
                            className="bg-amber-200 font-medium py-2 px-4 rounded-lg shadow-md w-full"
                            onClick={click}
                        >
                            Зарегистрироваться
                        </button>
                    </div>
                    <div className="w-full text-center mt=4 text-sm hover:text-secondary">
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
});

export default Auth;
