import React from 'react';
import {
    XCircleIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const Modal = ({ isOpen, onClose, onConfirm, title, message, isConfirmation, type }) => {
    if (!isOpen) return null;

    const getModalTypeClasses = () => {
        switch (type) {
            case 'success':
                return 'bg-green-100 border-green-400 text-green-700';
            case 'error':
                return 'bg-red-100 border-red-400 text-red-700';
            case 'alert':
                return 'bg-yellow-100 border-yellow-400 text-yellow-700';
            case 'question':
                return 'bg-blue-100 border-blue-400 text-blue-700';
            default:
                return 'bg-white border-gray-300 text-gray-700';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
            case 'error':
                return <ExclamationCircleIcon className="w-6 h-6 text-red-500" />;
            case 'alert':
                return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
            case 'question':
                return <QuestionMarkCircleIcon className="w-6 h-6 text-blue-500" />;
            default:
                return null;
        }
    };

    const modalTypeClasses = getModalTypeClasses();
    const Icon = getIcon();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 border-l-4 ${modalTypeClasses}`}>
                <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center space-x-2">
                        {Icon}
                        <h3 className="text-xl font-semibold">{title}</h3>
                    </div>
                    <button onClick={onClose}>
                        <XCircleIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                    </button>
                </div>
                <div className="mt-4">
                    <p>{message}</p>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none transition-colors duration-300"
                    >
                        {isConfirmation ? 'Cancel' : 'Close'}
                    </button>
                    {isConfirmation && (
                        <button
                            onClick={onConfirm}
                            tabIndex={0}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none transition-colors duration-300"
                        >
                            Confirm
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
