import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { addRating } from '../http/ratingAPI';
import { useContext } from 'react';
import { Context } from '../main';
import Tooltip from './ToolTip';

export const AddRatingModal = ({ isOpen, onClose, info, deviceStore }) => {
    if (!isOpen) return null;

    const { user } = useContext(Context);

    const [rating, setRating] = useState(info.rating);
    const [hoverRating, setHoverRating] = useState(0);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState('');

    const handleMouseOver = (index) => {
        setHoverRating(index + 1);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleClick = (index) => {
        setRating(index + 1);
    };
    const userId = user.user.id;
    

    const handleAddRating = async () => {
        try {
            await addRating(info.id, rating, userId);
            onClose();
        } catch (e) {
            setTooltipMessage(`Произошла ошибка. Попробуйте позже`);
            setTooltipVisible(true);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        {tooltipVisible && (
            <Tooltip 
                message={tooltipMessage} 
                duration={3000} 
                onClose={() => setTooltipVisible(false)} 
            />
        )}
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <span 
                    className="cursor-pointer text-lg float-right" 
                    onClick={onClose}
                >
                    &times;
                </span>
                <h2 className="text-center text-xl text-orange-600 font-semibold">Оценить данный товар?</h2>
                <img 
                    src={import.meta.env.VITE_API_URL + info.img} 
                    alt={info.name} 
                    className="w-1/2 mx-auto" 
                />
                <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-center">{info.name}</h2>
                    <div className="flex justify-between mx-10 text-lg">
                        <p>Бренд:
                            <img
                                src={import.meta.env.VITE_API_URL + deviceStore.brands.find(brand => brand.id === info.brandId)?.img}
                                alt={deviceStore.brands.find(brand => brand.id === info.brandId)?.name || 'Не указано'}
                                className='w-1/6 inline-block'
                            />
                        </p>
                        <p className="whitespace-nowrap">От чего: {deviceStore.types.find(type => type.id === info.typeId)?.name || 'Не указано'}</p>
                    </div>
                </div>
                <span className="flex text-yellow-500 justify-center text-7xl mx-auto">
                    {Array.from({ length: 5 }, (_, index) => (
                        <FaStar 
                            key={index} 
                            className={`mr-1 ${index < (hoverRating || rating) ? 'text-yellow-500' : 'text-gray-300'}`} 
                            onMouseOver={() => handleMouseOver(index)} 
                            onMouseLeave={handleMouseLeave} 
                            onClick={() => handleClick(index)}
                        />
                    ))}
                </span>
                <span className="flex justify-center text-5xl text-orange-600 font-semibold font-serif my-5">{rating}</span>
                <button 
                    className="bg-amber-200 text-orange-600 py-2 px-4 rounded w-full"
                    onClick={handleAddRating}
                >
                    Оценить
                </button>
            </div>
        </div>
    );
};
