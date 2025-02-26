import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../main';

export const TypeBar = observer(() => {
    const { device } = useContext(Context);

    const handleTypeClick = (type) => {
        if (device.selectedType && device.selectedType.id === type.id) {
            device.setSelectedType([]);
        } else {
            device.setSelectedType(type);
        }
    };

    return ( 
        <ul className='mt-10 mx-10'>
            <h1 className='text-xl font-serif font-semibold text-gray-700'>Чем болеете?</h1>
            {device.types.map(type => {
                const isSelected = device.selectedType && device.selectedType.id === type.id;

                return (
                    <li className={`py-1.5 px-3 my-5 rounded-xl shadow-md text-center cursor-pointer 
                            ${isSelected ? 'bg-amber-200' : 'bg-amber-50 text-gray-500'}`}
                        key={type.id}
                        onClick={() => handleTypeClick(type)}
                    >
                        {type.name}
                    </li>
                );
            })}
        </ul>
    );
});
