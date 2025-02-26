import { useState } from 'react';
import { createType } from '../http/deviceAPI';

export const CreateType = ({ isOpen, onClose }) => {
    const [typeName, setTypeName] = useState('');

    const handleAddType = () => {
        createType({name: typeName}).then(data => setTypeName(''));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <span 
                    className="cursor-pointer text-lg float-right" 
                    onClick={onClose}
                >
                    &times;
                </span>
                <h2 className="text-center text-xl text-orange-600 font-semibold">Добавить новый тип лекарства</h2>
                <label className="block mt-4">Название типа лекарства:</label>
                <input 
                    type="text"  
                    value={typeName} 
                    onChange={(e) => setTypeName(e.target.value)} 
                    className="border p-2 w-full mb-4"
                />
                <button 
                    className="bg-amber-200 text-orange-600 py-2 px-4 rounded w-full"
                    onClick={handleAddType}
                >
                    Добавить
                </button>
            </div>
        </div>
    );
};
