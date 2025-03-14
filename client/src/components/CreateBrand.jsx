import { useState, useEffect, useContext } from 'react';
import { Context } from '../main';
import { createBrand, fetchBrands, deleteBrand } from '../http/deviceAPI';
import { FaChevronDown, FaTrash, FaPlus } from 'react-icons/fa';
import Tooltip from './ToolTip';

export const CreateBrand = ({ isOpen, onClose }) => {
    const { device } = useContext(Context);
    const [brandName, setBrandName] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState('');
    const [choiceModal, setChoiceModal] = useState('Create');

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [isDropdownBrandOpen, setIsDropdownBrandOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBrands().then(data => device.setBrands(data))
    }, [])

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

    const handleAddBrand = async () => {
        const formData = new FormData();
        if (imgFile && brandName) {
            formData.append('img', imgFile);
            formData.append('name', brandName);
        } else {
            setTooltipMessage(`Произошла ошибка. Обязательные данные не введены.`);
            return setTooltipVisible(true);
        }
        try {
            await createBrand(formData);
            setBrandName('');
            setImgFile(null);
            onClose();
        } catch (e) {
            setTooltipMessage(e);
            setTooltipVisible(true);
        }
    };

    const handleDeleteBrand = async () => {
        try {
            if (selectedBrand) {
                const brandId = selectedBrand.id;
                await deleteBrand(brandId);
                setSelectedBrand('');
                setChoiceModal('Create');
                onClose();
            } else {
                setTooltipMessage(`Произошла ошибка. Обязательные данные не введены.`);
                return setTooltipVisible(true);
            }
        } catch (e) {
            setTooltipMessage(`Произошла ошибка. Попробуйте позже`);
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
            <div className="bg-white p-6 mx-2 sm:mx-0 rounded-lg shadow-lg w-full sm:w-1/2 md:w-1/3">
                <span 
                    className="cursor-pointer text-lg float-right" 
                    onClick={onClose}
                >
                    &times;
                </span>
                {choiceModal == "Create" ?
                <>
                    <h2 className="text-center text-xl text-orange-600 font-semibold">Добавить новый бренд лекарства</h2>
                    <label className="block mt-4">Название бренда лекарства:</label>
                    <input 
                        type="text"  
                        value={brandName} 
                        onChange={(e) => setBrandName(e.target.value)} 
                        className="border p-2 w-full mb-4"
                    />
                    <label className="block mt-4">Изображение:</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setImgFile(e.target.files[0])} 
                        className="border p-2 w-full mb-4"
                    />
                    <div className='flex'>
                        <button 
                            className="bg-amber-200 text-orange-600 py-2 px-4 rounded w-full"
                            onClick={handleAddBrand}
                        >
                            Добавить
                        </button>
                        <button 
                            className="bg-amber-200 text-orange-600 py-2 px-2 ml-2 rounded"
                            onClick={() => setChoiceModal("Delete")}
                        >
                             <FaTrash />
                        </button>
                    </div>
                </>
                :
                <>
                    <h2 className="text-center text-xl text-orange-600 font-semibold">Удалить бренд лекарства</h2>
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
                        {selectedBrand && (
                        <>
                            <img
                                src={import.meta.env.VITE_STATIC_API_URL + selectedBrand.img }
                                alt={selectedBrand.name}
                                className="w-1/2 mx-auto mt-1"
                            />
                            <h2 className="text-xl font-semibold text-center">Вы выбрали: {selectedBrand.name}</h2>
                        </>
                        )}
                    </div>
                    <div className='flex'>
                        <button 
                            className="bg-amber-200 text-orange-600 py-2 px-4 rounded w-full"
                            onClick={handleDeleteBrand}
                        >
                            Удалить
                        </button>
                        <button 
                            className="bg-amber-200 text-orange-600 py-2 px-2 ml-2 rounded"
                            onClick={() => setChoiceModal("Create")}
                        >
                             <FaPlus />
                        </button>
                    </div>
                </>
                }
            </div>
        </div>
    );
};
