const DeleteDevice = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-lg font-semibold">Вы действительно хотите удалить препарат?</h2>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2">Нет</button>
                    <button onClick={onConfirm} className="bg-red-500 text-white py-2 px-4 rounded">Да</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteDevice;
