import { observer } from 'mobx-react-lite';
import { FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { DEVICE_ROUTE } from '../utils/const';
import { useContext } from 'react';
import { Context } from '../main';


export const DeviceItem = observer(({ device }) => {
    const navigate = useNavigate();
    const { device: deviceStore } = useContext(Context);

    const typeName = deviceStore.types.find(type => type.id === device.typeId)?.name || 'Не указано';
    const brandName = deviceStore.brands.find(brand => brand.id === device.brandId)?.name || 'Не указано';

    return (  
        <div className="border p-4 rounded-lg shadow-md text-center flex flex-col flex-grow">
            <img className='w-full h-32 object-contain mx-auto' src={import.meta.env.VITE_API_URL + device.img} alt={device.name} />
            <h2 className="mt-2 text-lg font-semibold overflow-hidden whitespace-nowrap text-ellipsis" style={{ maxWidth: '100%' }}>
                {device.name}
            </h2>
            <div className='flex'>
                <h2 className="w-1/3 py-1 rounded-md shadow-md text-center text-sm bg-amber-200 text-orange-600">{typeName}</h2>
            </div>
            <p className="text-xl font-bold text-gray-800 mt-1">{device.price} руб.</p>
            <button className="mt-3 bg-amber-200 text-orange-600 py-2 px-4 rounded font-semibold"
                onClick={() => navigate(DEVICE_ROUTE + '/' + device.id)}
            >
                Перейти
            </button>
            <h2 className="flex items-center justify-start text-gray-400">{brandName}</h2>
            <div className="flex items-center justify-end mt-auto">
                <FaRegStar className="mr=1" />
                <span>{device.rating}</span>
            </div>
        </div>
    );
});
