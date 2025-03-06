import { useState } from 'react';
import { CreateType } from '../components/CreateType';
import { CreateBrand } from '../components/CreateBrand';
import { CreateDevice } from '../components/CreateDevice';
import { GetUsers } from '../components/GetUsers';


function Admin() {
    const [isModalTypeOpen, setIsModalTypeOpen] = useState(false);
    const openTypeModal = () => setIsModalTypeOpen(true);
    const closeTypeModal = () => setIsModalTypeOpen(false);

    const [isModalBrandOpen, setIsModalBrandOpen] = useState(false);
    const openBrandModal = () => setIsModalBrandOpen(true);
    const closeBrandModal = () => setIsModalBrandOpen(false);

    const [isModalDeviceOpen, setIsModalDeviceOpen] = useState(false);
    const openDeviceModal = () => setIsModalDeviceOpen(true);
    const closeDeviceModal = () => setIsModalDeviceOpen(false);

    const [isModalUsersOpen, setIsModalUsersOpen] = useState(false);
    const openUsersModal = () => setIsModalUsersOpen(true);
    const closeUsersModal = () => setIsModalUsersOpen(false);

    return (  
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <button 
                    className="w-3/4 sm:w-1/2 xl:w-1/5 bg-amber-200 text-orange-600 py-2 rounded"
                    onClick={openTypeModal}
                >
                    Добавить новый тип лекарств
                </button>
                <button 
                    className="w-3/4 sm:w-1/2 xl:w-1/5 bg-amber-200 text-orange-600 py-2 rounded my-12"
                    onClick={openBrandModal}
                >
                    Добавить новый бренд лекарств
                </button>
                <button 
                    className="w-3/4 sm:w-1/2 xl:w-1/5 bg-amber-200 text-orange-600 py-2 rounded"
                    onClick={openDeviceModal}
                >
                    Добавить новый товар
                </button>
                <button 
                    className="w-3/4 sm:w-1/2 xl:w-1/5 bg-amber-200 text-orange-600 py-2 rounded"
                    onClick={openUsersModal}
                >
                    Список всех авторизированных пользователей
                </button>
                
                <CreateType isOpen={isModalTypeOpen} onClose={closeTypeModal} />
                <CreateBrand isOpen={isModalBrandOpen} onClose={closeBrandModal} />
                <CreateDevice isOpen={isModalDeviceOpen} onClose={closeDeviceModal} />
                <GetUsers isOpen={isModalUsersOpen} onClose={closeUsersModal} />
            </div>
        </>
    );
}

export default Admin;
