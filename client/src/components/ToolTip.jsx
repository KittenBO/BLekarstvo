import { useEffect, useState } from 'react';

const Tooltip = ({ message, duration, onClose }) => {
    const [progress, setProgress] = useState(100);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev <= 0) {
                    clearInterval(interval);
                    setIsVisible(false);
                    return 0;
                }
                return prev - (100 / (duration / 100));
            });
        }, 100);

        return () => clearInterval(interval);
    }, [duration]);

    useEffect(() => {
        if (!isVisible) {
            const timer = setTimeout(onClose, 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-end justify-center">
            <div className="bg-white shadow-lg p-6 rounded-xl w-full max-w-md mb-8 relative">
                <div
                    className="absolute rounded-xl top-0 left-0 h-2 bg-amber-200"
                    style={{
                        width: `${progress}%`,
                        transition: 'width 0.1s linear',
                    }}
                ></div>
                <h3 className="text-2xl font-bold mb-4">Подсказка</h3>
                <p>{message}</p>
                <button
                    onClick={onClose}
                    className="mt-4 bg-amber-200 text-orange-600 px-4 py-2 rounded-md"
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default Tooltip;
