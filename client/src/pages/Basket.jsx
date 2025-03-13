import { useEffect, useState, useContext } from 'react';
import { Context } from '../main';
import { FaTrash } from 'react-icons/fa';
import Tooltip from '../components/ToolTip';
import { getBasket, updateBasketItem, removeFromBasket, clearBasket } from '../http/basketAPI';
import { fetchBrands, fetchTypes } from '../http/deviceAPI';
import { addToHistory } from '../http/historyAPI';

export const Basket = () => {
    const [devices, setDevices] = useState([]);
    const { device: deviceStore } = useContext(Context);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState('');

    useEffect(() => {
        fetchTypes().then(data => deviceStore.setTypes(data));
        fetchBrands().then(data => deviceStore.setBrands(data));
        fetchBasket();
    }, []);

    const fetchBasket = async () => {
        try {
            const data = await getBasket();
            setDevices(data);
        } catch (error) {
            console.error('Ошибка при получении данных корзины:', error);
        }
    };

    const updateQuantity = async (deviceId, newQuantity) => {
        if (newQuantity < 1 || newQuantity > 99) return;

        try {
            await updateBasketItem(deviceId, newQuantity);

            setDevices(prevDevices =>
                prevDevices.map(device =>
                    device.device.id === deviceId ? { ...device, quantity: newQuantity } : device
                )
            );
        } catch (error) {
            console.error('Ошибка при обновлении количества:', error);
        }
    };

    const removeBasket = async (deviceId) => {
        try {
            await removeFromBasket(deviceId);

            setDevices(prevDevices => prevDevices.filter(device => device.device.id !== deviceId));
        } catch (error) {
            console.error('Ошибка при удалении из корзины:', error);
        }
    }

    const addHistory = async () => {
        try {
            const orders = devices.map(item => ({
                deviceId: item.device.id,
                quantity: item.quantity,
                totalPrice: item.device.price * item.quantity,
                status: "Успешно",
            }));

            await Promise.all(orders.map(order => addToHistory(order.deviceId, order.quantity, order.totalPrice, order.status)));
            await clearBasket();
            setTooltipMessage('Товар успешно оплачен. Подробности можно узнать в истории заказов.');
            setTooltipVisible(true);
            setDevices([]);
        } catch (error) {
            setTooltipMessage(`Ошибка при добавлении в корзину: ${error.response?.data?.message || error.message}`);
            setTooltipVisible(true);
        }
    }

    return (
        <div className="container mx-auto flex mt-10 text-xs md:text-base pb-32 sm:pb-0">
            {tooltipVisible && (
                <Tooltip
                    message={tooltipMessage}
                    duration={3000}
                    onClose={() => setTooltipVisible(false)}
                />
            )}
            <div className="w-full sm:w-2/3 pr-4 mb-44 mx-1">
                {devices.length > 0 ? devices.map((item) => (
                    <div key={item.id} className="flex items-center border-b py-4">
                        <img
                            src={import.meta.env.VITE_STATIC_API_URL + item.device.img}
                            alt={item.device.name}
                            className="w-16 h-auto mr-4"
                        />
                        <div className="flex-grow">
                            <h2 className="text-lg font-semibold">{item.device.name}</h2>
                            <p>Бренд: <span className="text-orange-600">{deviceStore.brands.find(brand => brand.id === item.device.brandId)?.name || 'Не указано'}</span></p>
                            <p>Тип: <span className="text-orange-600">{deviceStore.types.find(type => type.id === item.device.typeId)?.name || 'Не указано'}</span></p>
                        </div>
                        <div>
                        <div className="flex items-center">
                            <button
                                onClick={() => updateQuantity(item.device.id, Math.max(1, item.quantity - 1))}
                                className="bg-amber-200 text-black px-3 rounded-l flex items-center justify-center h-5"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                value={item.quantity}
                                min="1"
                                max="99"
                                onChange={(e) =>
                                updateQuantity(item.device.id, Math.max(1, Math.min(99, Number(e.target.value))))
                                }
                                className="text-center w-10 border border-amber-200 h-5"
                                style={{ appearance: 'none', MozAppearance: 'textfield' }}
                            />
                            <button
                                onClick={() => updateQuantity(item.device.id, Math.min(99, item.quantity + 1))}
                                className="bg-amber-200 text-black px-3 rounded-r flex items-center justify-center h-5"
                            >
                                +
                            </button>
                        </div>
                            <span className="text-orange-600 sm:text-lg font-bold">{item.device.price * item.quantity}₽</span>
                        </div>
                        <button
                            className="text-orange-600 hover:text-red-500 mx-2 xs:mx-10 text-lg"
                            onClick={() => removeBasket(item.device.id)}>
                            <FaTrash />
                        </button>
                    </div>
                ))
                    :
                    <div className='flex'>
                        <span className='mx-auto text-lg text-gray-400 mt-[10vh]'>Здесь ничего нет</span>
                    </div>
                }
            </div>


            <div className="hidden sm:inline cart-summary w-1/3 pl-4 mx-1">
                <h2 className="text-xl font-semibold mb-4">Итоговая цена</h2>
                <div className="border p-4 mb-4">
                    <label htmlFor="promo-code" className="block mt-2">Промокод:</label>
                    <input type="text" id="promo-code" placeholder="BLekarstvo" className="border p-2 w-full mb-4" />
                    <button className="bg-amber-200 text-orange-600 py-1.5 md:py-2 px-2 md:px-4 rounded">Применить</button>
                    <p className="font-semibold md:text-lg md:mt-5">Общая сумма:
                        <span className="total-price text-orange-600">
                            {devices.reduce((total, item) => total + (item.device.price * item.quantity), 0)} ₽
                        </span>
                    </p>
                </div>
                <button className="bg-amber-200 text-orange-600 py-2 px-4 rounded w-full" onClick={addHistory}>Оплатить</button>
            </div>

            <div className="fixed bottom-0 left-0 right-0 sm:hidden cart-summary w-full p-4 bg-white border-t">
                <h2 className="text-xl font-semibold mb-4">Итоговая цена</h2>
                <div className="border p-4 mb-4">
                    <label className="block mt-2 text-lg">Промокод:</label>
                    <input type="text" id="promo-code" placeholder="BLekarstvo" className="border p-2 w-full mb-1 xs:mb-4 text-lg" />
                    <button className="bg-amber-200 text-orange-600 py-1.5 md:py-2 px-2 md:px-4 rounded">Применить</button>
                    <p className="font-semibold md:text-lg md:mt-5">Общая сумма:
                        <span className="text-orange-600">
                            {devices.reduce((total, item) => total + (item.device.price * item.quantity), 0)} ₽
                        </span>
                    </p>
                </div>
                <button className="bg-amber-200 text-orange-600 py-2 px-4 rounded w-full text-lg" onClick={addHistory}>Оплатить</button>
            </div>
        </div>
    );
};