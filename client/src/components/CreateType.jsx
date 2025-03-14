import { useState, useEffect, useContext } from 'react';
import { Context } from '../main';
import { observer } from 'mobx-react-lite';
import { createType, fetchTypes, deleteType } from '../http/deviceAPI';
import { FaChevronDown, FaTrash, FaPlus } from 'react-icons/fa';
import Tooltip from './ToolTip';

export const CreateType = observer(({ isOpen, onClose }) => {
    const { device } = useContext(Context);
    const [typeName, setTypeName] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState('');
    const [choiceModal, setChoiceModal] = useState('Create');

    const [selectedType, setSelectedType] = useState(null);
    const [isDropdownTypeOpen, setIsDropdownTypeOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data))
    }, [])

    const toggleDropdownType = () => {
        setIsDropdownTypeOpen(prev => !prev);
    };

    const handleSelectType = (type) => {
        setSelectedType(type);
        setIsDropdownTypeOpen(false);
    };

    const filteredTypes = device.types.filter(type =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );    

    const handleAddType = async () => {
        try {
            if (!typeName) {
                setTooltipMessage(`Произошла ошибка. Название не указанно`);
                return setTooltipVisible(true); 
            }
            createType({name: typeName}).then(window.location.reload());
        } catch (e) {
            setTooltipMessage(`Произошла ошибка. Попробуйте позже`);
            setTooltipVisible(true);
        }
    };

    const handleDeleteType = async () => {
        try {
            if (!selectedType) {
                setTooltipMessage(`Произошла ошибка. Название не указанно`);
                return setTooltipVisible(true); 
            }
            const typeId = selectedType.id;
            deleteType(typeId).finally(window.location.reload());
            setSelectedType('');
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
                    <h2 className="text-center text-xl text-orange-600 font-semibold">Добавить новый тип лекарства</h2>
                    <label className="block mt-4">Название типа лекарства:</label>
                    <input 
                        type="text"  
                        value={typeName} 
                        onChange={(e) => setTypeName(e.target.value)} 
                        className="border p-2 w-full mb-4"
                    />
                    <div className='flex'>
                        <button 
                            className="bg-amber-200 text-orange-600 py-2 px-4 rounded w-full"
                            onClick={handleAddType}
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
                    <h2 className="text-center text-xl text-orange-600 font-semibold">Удалить тип лекарства</h2>
                    <label className="block mt-4">Название типа лекарства:</label>
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
                                <input
                                    type="text"
                                    placeholder="Поиск..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border p-2 w-full mb-2"
                                />
                                <div className="max-h-60 overflow-y-auto">
                                    {filteredTypes.length > 0 ? (
                                        filteredTypes.map(type => (
                                            <button 
                                                key={type.id} 
                                                onClick={() => handleSelectType(type)} 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                {type.name}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-gray-500">Нет результатов</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex'>
                        <button 
                            className="bg-amber-200 text-orange-600 py-2 px-4 rounded w-full"
                            onClick={handleDeleteType}
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
});
