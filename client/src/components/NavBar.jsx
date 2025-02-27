import { useContext, useState, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { CgProfile } from "react-icons/cg";
import { FaShoppingCart, FaCog, FaSignOutAlt, FaHistory } from 'react-icons/fa';
import { MdLocalPharmacy } from 'react-icons/md';
import { RxHamburgerMenu } from "react-icons/rx";
import { NavLink } from 'react-router-dom';
import { ADMIN_ROUTE, BASKET_ROUTE, HISTORY_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from '../utils/const';
import { Context } from '../main';
import { observer } from 'mobx-react-lite';
import { check } from  '../http/userAPI'

const NavBar = observer(() => {
  const [isOpenHamburger, setIsOpenHamburger] = useState(false);
  const toggleHamburger = () => {
    setIsOpenHamburger(prev => !prev);
  };

  const { user } = useContext(Context);
  const nodeRef = useRef(null);

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem('token');
    window.location.reload();  
  }

  return (
    <header className="w-full bg-amber-50 text-orange-600">
      <ul className="flex container mx-auto py-4">
        <NavLink to={SHOP_ROUTE} className='text-3xl font-thin'>
            <MdLocalPharmacy className='inline-block mx-1 -mt-1' />БЛекарство
        </NavLink>
        <div className='hidden md:flex text-xs lg:text-base gap-20 ml-auto items-center'>
          {user.isAuth ? (
            <>
              {user.role === "ADMIN" && (
                <NavLink to={ADMIN_ROUTE} className="bg-amber-200 py-1.5 px-3 rounded-sm shadow-md">
                  <FaCog className='inline-block mx-1' />Админ-панель
                </NavLink>
              )}
              <NavLink to={SHOP_ROUTE} onClick={logOut} className="bg-amber-200 py-1.5 px-3 rounded-sm shadow-md">
                <FaSignOutAlt className='inline-block mx-1' />Выйти
              </NavLink>
              <NavLink to={BASKET_ROUTE} className="bg-amber-200 py-1.5 px-3 rounded-sm shadow-md">
                <FaShoppingCart className='inline-block mx-1' />Корзина
              </NavLink>
              <NavLink to={HISTORY_ROUTE} className="bg-amber-200 py-1.5 px-3 rounded-sm shadow-md">
                <FaHistory className='inline-block mx-1' />История заказов
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to={LOGIN_ROUTE} className="bg-amber-200 py-1.5 px-3 rounded-sm shadow-md">
                <CgProfile className='inline-block mx-1' />Авторизация/Регистрация
              </NavLink>
            </>
          )}
        </div>
        <div className="flex md:hidden relative items-center ml-auto">
          <RxHamburgerMenu className='text-xl mr-8' onClick={toggleHamburger} />
          <CSSTransition 
            in={isOpenHamburger} 
            timeout={300} 
            classNames="alert" 
            unmountOnExit
            nodeRef={nodeRef}
          >
            <ul ref={nodeRef} className="absolute text-sm mt-5 bg-amber-50 top-full right-0 shadow-md rounded-md p-4 w-60 z-10">
              {user.isAuth ? (
                <>
                  {user.role === "ADMIN" && (
                    <NavLink to={ADMIN_ROUTE} className="flex items-center">
                      <FaCog className='inline-block mx=1' />Админ-панель
                    </NavLink>
                  )}
                  <li className="border-t border-grayProfile my=1"></li>
                  <NavLink to={SHOP_ROUTE} onClick={logOut}>
                    <FaSignOutAlt className='inline-block mx=1' />Выйти
                  </NavLink>
                  <li className="border-t border-grayProfile my=1"></li>
                  <NavLink to={BASKET_ROUTE}>
                    <FaShoppingCart className='inline-block mx=1' />Корзина
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to={LOGIN_ROUTE}>
                    <CgProfile className='inline-block mx=1' />Авторизация/Регистрация
                  </NavLink>
                </>
              )}
            </ul>
          </CSSTransition>
        </div>
      </ul>
    </header>
  );
})

export default NavBar;
