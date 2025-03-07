import Admin from './pages/Admin';
import { Basket } from './pages/Basket';
import SHOP from './pages/Shop';
import Auth from './pages/Auth';
import DevicePage from './pages/DevicePage';
import History from './pages/History';
import { ADMIN_ROUTE, BASKET_ROUTE, DEVICE_ROUTE, HISTORY_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from './utils/const'

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: BASKET_ROUTE,
        Component: Basket
    },
    {
        path: HISTORY_ROUTE,
        Component: History
    }
]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: SHOP
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: DEVICE_ROUTE + '/:id',
        Component: DevicePage
    }
]