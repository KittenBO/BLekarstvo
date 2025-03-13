import { useState } from 'react';
import UserService from '../services/UserService';
import Tooltip from './ToolTip';

export const GetUsers = ({ isOpen, onClose }) => {
    const [users, setUsers] = useState([]);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState('');   

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch(e) {
            setTooltipMessage(`Произошла ошибка. ${e.response?.data?.message}`);
            setTooltipVisible(true);
        }
    }

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
                <h2 className="text-center text-xl text-orange-600 font-semibold">Вывести список всех пользователей</h2>
                {users.map(user =>
                    <ul className=""key={user.id}>
                        <li>[ID {user.id}] {user.email} Почта активированна: {user.isActivated ?
                        'Да'
                        :
                        'Нет'}</li>
                        <li className="border-t border-grayProfile my-3 sm:my-1"></li>
                    </ul>
                )}
                <button 
                    className="bg-amber-200 text-orange-600 py-2 px-4 rounded w-full"
                    onClick={getUsers}
                >
                    Получить список пользователей
                </button>
            </div>
        </div>
    );
};
