import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../main';
import { FaChevronDown } from 'react-icons/fa';
import { putDevice } from '../http/deviceAPI';
import { SHOP_ROUTE } from '../utils/const';
import Tooltip from './ToolTip';

const EditDevice = ({ isOpen, onClose, device }) => {
    const { device: deviceStore } = useContext(Context);
    const navigate = useNavigate();

    const [deviceName, setDeviceName] = useState('');
    const [price, setPrice] = useState(0);
    const [imgFile, setImgFile] = useState(null);
    const [info, setInfo] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    
    const [isDropdownTypeOpen, setIsDropdownTypeOpen] = useState(false);
    const [isDropdownBrandOpen, setIsDropdownBrandOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState('');

    useEffect(() => {
        if (isOpen && device) {
            setDeviceName(device.name || '');
            setPrice(device.price || 0);
            setImgFile(null);
            setInfo(device.info || []);
            setSelectedType(deviceStore.types.find(type => type.id === device.typeId) || null);
            setSelectedBrand(deviceStore.brands.find(brand => brand.id === device.brandId) || null);
        }
    }, [isOpen, device]);

    const toggleDropdownType = () => {
        setIsDropdownTypeOpen(prev => !prev);
    };

    const handleSelectType = (type) => {
        setSelectedType(type);
        setIsDropdownTypeOpen(false);
    };

    const toggleDropdownBrand = () => {
        setIsDropdownBrandOpen(prev => !prev);
    };

    const handleSelectBrand = (brand) => {
        setSelectedBrand(brand);
        setIsDropdownBrandOpen(false);
    };

    const updateInfoField = (id, field, value) => {
        setInfo(info.map(i => (i.id === id ? { ...i, [field]: value } : i)));
    };

    const removeInfoField = (id) => {
        setInfo(info.filter(i => i.id !== id));
    };

    const addInfoField = () => {
        if (info.length < 3) { 
            setInfo([...info, { title: '', description: '', id: Date.now() }]);
        }
    };

    const handleUpdateDevice = async () => {
        const formData = new FormData();
        formData.append('name', deviceName);
        formData.append('price', price);

        if (imgFile) {
            formData.append('img', imgFile); 
        }

        formData.append('typeId', selectedType?.id);
        formData.append('brandId', selectedBrand?.id);
        
        formData.append('info', JSON.stringify(info));

        try {
            putDevice(device.id, formData).then(onClose());
        } catch (e) {
            setTooltipMessage(`Произошла ошибка. ${e.response?.data?.message}`);
            setTooltipVisible(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        {tooltipVisible && (
            <Tooltip 
                message={tooltipMessage} 
                duration={3000} 
                onClose={() => setTooltipVisible(false)} 
            />
        )}
            <div className="bg-white p-6 mx-2 sm:mx-0 rounded-lg shadow-lg w-full md:w-1/2 max-h-[90vh] overflow-y-auto">
                <span className="cursor-pointer text-lg float-right" onClick={onClose}>&times;</span>
                <h2 className="text-center text-xl text-orange-600 font-semibold">Обновить устройство</h2>

                <label className="block mt-4">Название Препарата:</label>
                <input 
                    type="text" 
                    value={deviceName} 
                    onChange={(e) => setDeviceName(e.target.value)} 
                    className="border p-2 w-full mb-4" 
                />

                <label className="block mt-4">Цена:</label>
                <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="border p-2 w-full mb-4"
                    min="0"
                />

                <label className="block mt-4">Изображение:</label>
                {device.img && (
                    <img className='w-full h-32 object-contain mx-auto' src={import.meta.env.VITE_STATIC_API_URL + device.img} alt={device.name} />
                )}
                <label className="block mt-4">Новое изображение:</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImgFile(e.target.files[0])} 
                    className="border p-2 w-full mb-4" 
                />

                <button 
                    className="bg-amber-200 text-orange-600 py-1.5 px-3 rounded w-full my-4"
                    onClick={addInfoField}
                >
                    Добавить новое свойство (максимум 3)
                </button>

                {info.map(item => (
                    <div key={item.id} className='flex flex-col mb-4'>
                        <div className='flex justify-between'>
                            <div className='w-full pr-2'>
                                <label className="block">Заголовок:</label>
                                <input 
                                    type="text" 
                                    value={item.title || ''} // Используйте пустую строку вместо null
                                    onChange={(e) => updateInfoField(item.id, 'title', e.target.value)} 
                                    className="border p-2 w-full mb-2"
                                />
                            </div>
                            <button onClick={() => removeInfoField(item.id)} className="bg-red-500 text-white py-1.5 px-3 rounded ml-2 self-center">
                                Удалить
                            </button>
                        </div>
                        <div>
                            <label className="block">Описание:</label>
                            <textarea
                                value={item.description || ''}
                                onChange={(e) => updateInfoField(item.id, 'description', e.target.value)}
                                rows={3}
                                className="border p-2 w-full mb-2"
                            />
                        </div>
                    </div>
                ))}

                <div className="relative">
                    <button onClick={toggleDropdownType} className="flex justify-between items-center w-full border p-2 mb-4 rounded bg-white text-gray-700 hover:bg-gray-100">
                        {selectedType?.name || 'Выберите тип'} <FaChevronDown className="ml-2" />
                    </button>

                    {isDropdownTypeOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                            {deviceStore.types.map(type => (
                                <button key={type.id} onClick={() => handleSelectType(type)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                    {type.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button onClick={toggleDropdownBrand} className="flex justify-between items-center w-full border p-2 mb-4 rounded bg-white text-gray-700 hover:bg-gray-100">
                        {selectedBrand?.name || 'Выберите бренд'} <FaChevronDown className="ml-2" />
                    </button>

                    {isDropdownBrandOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                            <input type="text" placeholder="Поиск..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border p-2 w-full mb-2" />
                            {deviceStore.brands.filter(brand => brand.name.toLowerCase().includes(searchTerm.toLowerCase())).map(brand => (
                                <button key={brand.id} onClick={() => handleSelectBrand(brand)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                    {brand.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button 
                    className="bg-amber-200 text-orange-600 py-2 px-4 rounded w-full"
                    onClick={handleUpdateDevice}
                >
                    Обновить
                </button>
            </div>
        </div>
    );
};

export default EditDevice;
