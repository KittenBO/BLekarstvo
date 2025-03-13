import { useEffect, useState, useContext } from 'react';
import { FaPen } from 'react-icons/fa';
import { Context } from '../main';
import { getHistory } from '../http/historyAPI';
import { fetchOneDevice, fetchBrands, fetchTypes } from '../http/deviceAPI';
import { AddRatingModal } from '../components/addRatingModal';
import { observer } from 'mobx-react-lite';

const History = observer(() => {
    const [orders, setOrders] = useState([]);
    const { device: deviceStore } = useContext(Context);
    const [devicesInfo, setDevicesInfo] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deviceIdToRate, setDeviceIdToRate] = useState(null);

    const openModal = (deviceId) => {
        setDeviceIdToRate(deviceId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setDeviceIdToRate(null);
    };

    useEffect(() => {
        fetchTypes().then(data => deviceStore.setTypes(data));
        fetchBrands().then(data => deviceStore.setBrands(data));
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await getHistory();
            setOrders(data);

            const devicesIds = data.map(order => order.deviceId);
            const devices = await Promise.all(devicesIds.map(id => fetchOneDevice(id)));
            const devicesInfoMap = devices.reduce((acc, device) => ({ ...acc, [device.id]: device }), {});

            setDevicesInfo(devicesInfoMap);
        } catch (error) {
            console.error('Ошибка при получении данных истории:', error);
        }
    };

    return (
        <div className="container flex mx-auto mt-10 text-xs md:text-base">
            <div className="w-full pr-4 mx-1">
                {orders.length > 0 ? orders.map((order) => (
                    <>
                        <div key={order.id} className="hidden sm:flex items-center border-b py-4">
                            {devicesInfo[order.deviceId] && (
                                <img 
                                    src={import.meta.env.VITE_STATIC_API_URL + devicesInfo[order.deviceId].img} 
                                    alt={devicesInfo[order.deviceId].name} 
                                    className="w-16 h-auto mr-4" 
                                />
                            )}
                            <div className="flex-grow">
                                {devicesInfo[order.deviceId] && (
                                    <div>
                                        <h2 className="text-lg font-semibold">{devicesInfo[order.deviceId].name}</h2>
                                        <p>Бренд: {deviceStore.brands.find(brand => brand.id === devicesInfo[order.deviceId].brandId)?.name || 'Не указано'}</p>
                                        <p>От чего: {deviceStore.types.find(type => type.id === devicesInfo[order.deviceId].typeId)?.name || 'Не указано'}</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p>Количество: {order.quantity}</p>
                                <p>Общая стоимость: {order.totalPrice}₽</p>
                                <p>Статус: {order.status}</p>
                            </div>
                            <div className='flex flex-col'>
                                <button 
                                className="bg-amber-200 text-orange-600 py-1.5 px-3 rounded-sm shadow-md mx-10 whitespace-nowrap"
                                onClick={() => openModal(order.deviceId)}
                                >
                                    <FaPen className='inline-block mx-2' />Оставить отзыв
                                </button>

                                <p className='mx-auto mt-2 text-center '>
                                    Дата: {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                                </p>
                            </div>
                        </div>
                        <div key={order.id} className="flex sm:hidden items-center border-b py-4">
                            {devicesInfo[order.deviceId] && (
                                <img 
                                    src={import.meta.env.VITE_STATIC_API_URL + devicesInfo[order.deviceId].img} 
                                    alt={devicesInfo[order.deviceId].name} 
                                    className="w-16 h-auto mr-4" 
                                />
                            )}
                            <div className="flex-grow">
                                {devicesInfo[order.deviceId] && (
                                    <div>
                                        <h2 className="text-lg font-semibold">{devicesInfo[order.deviceId].name}</h2>
                                        <p>Количество: {order.quantity}</p>
                                        <p>Общая стоимость: {order.totalPrice}₽</p>
                                        <p>Статус: {order.status}</p>
                                    </div>
                                )}
                            </div>
                            <div className='flex flex-col'>
                                <button 
                                className="bg-amber-200 text-orange-600 py-1.5 px-3 rounded-sm shadow-md mx-3 xs:mx-10 whitespace-nowrap"
                                onClick={() => openModal(order.deviceId)}
                                >
                                    Оценить
                                </button>

                                <p className='mx-auto mt-2 text-center '>
                                    Дата: {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                                </p>
                            </div>
                        </div>
                    </>
                ))
                :
                <div className='flex'>
                    <span className='mx-auto md:text-lg text-gray-400 mt-[10vh]'>Здесь ничего нет</span>
                </div>
                }
            </div>
            {isModalOpen && (
                <AddRatingModal 
                    isOpen={isModalOpen} 
                    onClose={closeModal} 
                    info={devicesInfo[deviceIdToRate]} 
                    deviceStore={deviceStore}
                />
            )}
        </div>
    );
});

export default History;
