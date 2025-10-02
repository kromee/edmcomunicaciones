"use client";
import { useState } from 'react';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'confirm' | 'success' | 'error' | 'info';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function useModal() {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showModal = (config: Omit<ModalState, 'isOpen'>) => {
    setModal({
      ...config,
      isOpen: true
    });
  };

  const hideModal = () => {
    setModal(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void, confirmText = 'Confirmar', cancelText = 'Cancelar') => {
    showModal({
      title,
      message,
      type: 'confirm',
      onConfirm,
      confirmText,
      cancelText
    });
  };

  const showSuccess = (title: string, message: string) => {
    showModal({
      title,
      message,
      type: 'success'
    });
  };

  const showError = (title: string, message: string) => {
    showModal({
      title,
      message,
      type: 'error'
    });
  };

  const showInfo = (title: string, message: string) => {
    showModal({
      title,
      message,
      type: 'info'
    });
  };

  return {
    modal,
    showModal,
    hideModal,
    showConfirm,
    showSuccess,
    showError,
    showInfo
  };
}
