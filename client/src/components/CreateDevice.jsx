import { useState, useContext, useEffect } from 'react';
import { Context } from '../main';
import { createDevice, fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import { FaChevronDown } from 'react-icons/fa';
import Tooltip from './ToolTip';

export const CreateDevice = ({ isOpen, onClose }) => {
    const { device } = useContext(Context);

    useEffect(() => {
        try{
            fetchTypes().then(data => device.setTypes(data))
            fetchBrands().then(data => device.setBrands(data))
            fetchDevices().then(data => device.setDevices(data.rows))
        } catch(e) {
            setTooltipMessage(`Произошла ошибка. ${e.response?.data?.message || e.message}`);
            setTooltipVisible(true);
        }
    }, [])

    const [deviceName, setDeviceName] = useState('');
    const [price, setPrice] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState('');
    
    const [info, setInfo] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [isDropdownTypeOpen, setIsDropdownTypeOpen] = useState(false);

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [isDropdownBrandOpen, setIsDropdownBrandOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddDevice = () => {
        try {
            if (!deviceName || !price || !selectedType || !selectedBrand || !imgFile) {
                setTooltipMessage(`Произошла ошибка. Обязательные данные не введены`);
                return setTooltipVisible(true);
            }
            const formData = new FormData();
            formData.append('name', deviceName);
            formData.append('price', price);
            formData.append('typeId', selectedType.id);
            formData.append('brandId', selectedBrand.id);
            formData.append('img', imgFile);
            formData.append('info', JSON.stringify(info));
            createDevice(formData).then(data => onClose());
            setDeviceName('');
            setPrice('');
            setImgFile(null);
            setInfo([]);
            setSelectedType(null);
            setSelectedBrand(null);
            window.location.reload();
        } catch(e) {
            setTooltipMessage(`Произошла ошибка. Попробуйте позже`);
            setTooltipVisible(true);
        }
    };

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

    const filteredBrands = device.brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addInfoField = () => {
        if (info.length < 3) { 
            setInfo([...info, { title: '', description: '', id: Date.now() }]);
        }
    };

    const updateInfoField = (id, field, value) => {
        setInfo(info.map(i => (i.id === id ? { ...i, [field]: value } : i)));
    };

    const removeInfoField = (id) => {
        setInfo(info.filter(i => i.id !== id));
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[90vh] overflow-y-auto">
                <span 
                    className="cursor-pointer text-lg float-right" 
                    onClick={onClose}
                >
                    &times;
                </span>
                <h2 className="text-center text-xl text-orange-600 font-semibold">Добавить новый препарат</h2>
                
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

                {info.map(i => (
                    <div key={i.id} className='flex flex-col mb-4'>
                        <div className='flex justify-between'>
                            <div className='w-full pr-2'>
                                <label className="block">Заголовок:</label>
                                <input 
                                    type="text" 
                                    value={i.title} 
                                    onChange={(e) => updateInfoField(i.id, 'title', e.target.value)} 
                                    className="border p-2 w-full mb-2"
                                />
                            </div>
                            <button 
                                onClick={() => removeInfoField(i.id)} 
                                className="bg-red-500 text-white py-1.5 px-3 rounded ml-2 self-center"
                            >
                                Удалить
                            </button>
                        </div>
                        <div>
                            <label className="block">Описание:</label>
                            <textarea
                                value={i.description}
                                onChange={(e) => updateInfoField(i.id, 'description', e.target.value)}
                                rows={3}
                                className="border p-2 w-full mb-2"
                            />
                        </div>
                    </div>
                ))}

                <div className="relative">
                    <button 
                        onClick={toggleDropdownType} 
                        className="flex justify-between items-center w-full border p-2 mb-4 rounded bg-white text-gray-700 hover:bg-gray-100"
                    >
                        {selectedType ? selectedType.name : 'Выберите тип препарата:'}
                        <FaChevronDown className="ml-2" />
                    </button>
                    
                    {isDropdownTypeOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                            {device.types.map(type => (
                                <button 
                                    key={type.id} 
                                    onClick={() => handleSelectType(type)} 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                    {type.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button 
                        onClick={toggleDropdownBrand} 
                        className="flex justify-between items-center w-full border p-2 mb-4 rounded bg-white text-gray-700 hover:bg-gray-100"
                    >
                        {selectedBrand ? selectedBrand.name : 'Выберите бренд препарата:'}
                        <FaChevronDown className="ml-2" />
                    </button>
                    
                    {isDropdownBrandOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                            <input
                                type="text"
                                placeholder="Поиск..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border p-2 w-full mb-2"
                            />
                            <div className="max-h-60 overflow-y-auto">
                                {filteredBrands.length > 0 ? (
                                    filteredBrands.map(brand => (
                                        <button 
                                            key={brand.id} 
                                            onClick={() => handleSelectBrand(brand)} 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            {brand.name}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-sm text-gray-500">Нет результатов</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    className="bg-amber-200 text-orange-600 py-2 px-4 rounded w-full"
                    onClick={handleAddDevice}
                >
                    Добавить
                </button>
            </div>
        </div>
    );
};
