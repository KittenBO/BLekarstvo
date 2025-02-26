import React, { useState } from 'react';
import { createBrand } from '../http/deviceAPI';

export const CreateBrand = ({ isOpen, onClose }) => {
    const [brandName, setBrandName] = useState('');
    const [imgFile, setImgFile] = useState(null);

    const handleAddBrand = async () => {
        const formData = new FormData();
        formData.append('name', brandName);
        
        if (imgFile) {
            formData.append('img', imgFile); // Добавляем изображение только если оно выбрано
        }
    
        try {
            await createBrand(formData); // Отправляем FormData на сервер
            setBrandName('');
            setImgFile(null);
            onClose(); // Закрываем модальное окно после успешного добавления
        } catch (error) {
            console.error('Ошибка при добавлении бренда:', error);
        }
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
                <button 
                    className="bg-amber-200 text-orange-600 py-2 px-4 rounded w-full"
                    onClick={handleAddBrand}
                >
                    Добавить
                </button>
            </div>
        </div>
    );
};
