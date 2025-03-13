import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { createType } from '../http/deviceAPI';
import Tooltip from './ToolTip';

export const CreateType = observer(({ isOpen, onClose }) => {
    const [typeName, setTypeName] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState('');

    const handleAddType = async () => {
        try {
            if (!typeName) {
                setTooltipMessage(`Произошла ошибка. Название не указанно`);
                return setTooltipVisible(true); 
            }
            createType({name: typeName}).then(data => setTypeName(''));
            onClose();
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
});
