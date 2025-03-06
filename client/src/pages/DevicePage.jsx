import { useEffect, useState, useContext } from 'react';
import { Context } from '../main';
import { FaStar, FaRegStar, FaEdit, FaTrash } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOneDevice, fetchBrands, fetchTypes } from '../http/deviceAPI';
import { deleteDevice } from '../http/deviceAPI'; 
import DeleteDevice from '../components/DeleteDevice';
import EditDevice from '../components/EditDevice'; 
import Tooltip from '../components/ToolTip';
import { SHOP_ROUTE } from '../utils/const';
import { addToBasket } from '../http/basketAPI';
import { observer } from 'mobx-react-lite';

const DevicePage = observer(() => {
    const [device, setDevice] = useState({info: []});
    const { id } = useParams();
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { device: deviceStore } = useContext(Context);

    const typeName = deviceStore.types.find(type => type.id === device.typeId)?.name || 'Не указано';
    const brandName = deviceStore.brands.find(brand => brand.id === device.brandId)?.name || 'Не указано';

    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState('');

    const handleDelete = async () => {
        try {
            await deleteDevice(device.id);
            setIsDeleteModalOpen(false);
            navigate(SHOP_ROUTE)
        } catch (e) {
            setTooltipMessage(`Произошла ошибка. ${e.response?.data?.message || e.message}`);
            setTooltipVisible(true);
        }
    };

    useEffect(() => {
        fetchTypes().then(data => deviceStore.setTypes(data));
        fetchBrands().then(data => deviceStore.setBrands(data));
        fetchOneDevice(id).then(data => setDevice(data));
    }, []);

    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
        if (quantity < 99) {
            setQuantity(prev => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = async () => {
        try {
            await addToBasket(device.id, quantity);
            setTooltipMessage('Устройство добавлено в корзину!');
            setTooltipVisible(true);
        } catch (error) {
            setTooltipMessage(`Ошибка при добавлении в корзину: ${error.response?.data?.message || error.message}`);
            setTooltipVisible(true);
        }
    };

    return (  
        <div className="container mx-auto mt-10 flex flex-wrap sm:flex-nowrap">
            {tooltipVisible && (
                <Tooltip 
                    message={tooltipMessage} 
                    duration={3000} 
                    onClose={() => setTooltipVisible(false)} 
                />
            )}
            <div className="w-full sm:w-1/2 pr-4">
                <img src={import.meta.env.VITE_API_URL + device.img} alt={device.name} className="w-2/3 mx-auto" />
            </div>
            <div className="w-full sm:w-1/2 p-6 m-2 bg-white rounded-lg shadow-md h-auto mx-auto">
                <h1 className="text-xl font-bold">{device.name}</h1>
                <div className="flex items-center">
                    <span className="text-yellow-500 flex text-sm">
                        {Array.from({ length: 5 }, (_, index) => (
                            <FaStar key={index} className={`mr-1 ${index < device.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
                        ))}
                    </span>
                    <span className="ml-2">({device.rating}.0)</span>
                </div>

                <div className="mt-4">
                    <p>Брэнд: {brandName}</p>
                    <p className='flex'>
                        От чего: 
                        <h2 className="py-1 px-3 ml-2 rounded-md shadow-md text-center text-sm bg-amber-200 text-orange-600">{typeName}</h2>
                    </p>
                </div>

                <div className="p-4 mt-6 justify-items-end">
                    <h2 className="text-lg font-bold">Цена: {device.price} руб.</h2>

                    <button 
                        id="add-to-cart" 
                        className='bg-amber-200 text-orange-600 py-2 px-4 rounded mt-2' 
                        onClick={handleAddToCart}
                    >
                        В корзину
                    </button>

                    <div className='flex items-center mt-4'>
                        <button onClick={decreaseQuantity} className='bg-amber-200 text-black py-[1px] px-[12px] rounded-l flex items-center justify-center'>−</button>
                        <input 
                            type='number'  
                            value={quantity} 
                            min='1' 
                            max='99' 
                            onChange={(e) => setQuantity(Math.max(1, Math.min(99, Number(e.target.value))))}
                            className='text-center w-[50px] border border-amber-200'
                            style={{ appearance: 'none', MozAppearance: 'textfield' }}
                        />
                        <button onClick={increaseQuantity} className='bg-amber-200 text-black py-[1px] px-[12px] rounded-r flex items-center justify-center'>+</button>
                    </div>
                </div>

                <div className='mt-6 flex justify-between text-xs sm:text-base'>
                    {device.info.map(info =>
                        <div key={info.id}>
                            <h3 className='font-bold text-orange-600'>{info.title}</h3>
                            {info.description}
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-lg">
                        <button 
                            className="text-orange-600 hover:text-amber-200 mr-2"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            <FaEdit />
                        </button>
                        <button 
                            className="text-orange-600 hover:text-red-500"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                    <div className="flex items-center">
                        <FaRegStar className="mr-1" />
                        <span>{device.rating}</span>
                    </div>
                </div>                
            </div>

            <DeleteDevice 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
            
            <EditDevice
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                device={device}
                deviceStore={deviceStore}
            />
        </div>
    );
})

export default DevicePage;
