import { Routes, Route } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { Navigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../utils/const';
import { useContext } from 'react';
import { Context } from '../main';

function AppRouter() {
    const {user} = useContext(Context)
    return (
        <Routes>
            {user.isAuth && authRoutes.map(({ path, Component}) => 
                <Route key={path} path={path} element={<Component />} exact/>
            )}
            {publicRoutes.map(({ path, Component}) => 
                <Route key={path} path={path} element={<Component />} exact/>
            )}
            <Route path="*" element={<Navigate to={SHOP_ROUTE} />}/>
        </Routes>
    );
}

export default AppRouter;