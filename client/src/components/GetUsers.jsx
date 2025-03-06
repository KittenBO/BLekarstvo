import { useState } from 'react';
import UserService from '../services/UserService';

export const GetUsers = ({ isOpen, onClose }) => {
    const [users, setUsers] = useState([]);

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            console.log(response)
            setUsers(response.data);
        } catch(e) {
            console.log(e);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
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
