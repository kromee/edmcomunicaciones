"use client";
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'confirm' | 'success' | 'error' | 'info';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  message,
  type,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}: ModalProps) {
  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'confirm':
        return (
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        );
      case 'success':
        return (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case 'confirm':
        return {
          confirm: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          cancel: 'bg-gray-300 hover:bg-gray-400 text-gray-700'
        };
      case 'success':
        return {
          confirm: 'bg-green-600 hover:bg-green-700 text-white',
          cancel: 'bg-gray-300 hover:bg-gray-400 text-gray-700'
        };
      case 'error':
        return {
          confirm: 'bg-red-600 hover:bg-red-700 text-white',
          cancel: 'bg-gray-300 hover:bg-gray-400 text-gray-700'
        };
      case 'info':
        return {
          confirm: 'bg-blue-600 hover:bg-blue-700 text-white',
          cancel: 'bg-gray-300 hover:bg-gray-400 text-gray-700'
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            {getIcon()}
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          
          {/* Message */}
          <p className="text-gray-600 mb-6">{message}</p>
          
          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            {type === 'confirm' && (
              <>
                <button
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg font-medium transition ${buttonStyles.cancel}`}
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm?.();
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${buttonStyles.confirm}`}
                >
                  {confirmText}
                </button>
              </>
            )}
            
            {(type === 'success' || type === 'error' || type === 'info') && (
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg font-medium transition ${buttonStyles.confirm}`}
              >
                Entendido
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
