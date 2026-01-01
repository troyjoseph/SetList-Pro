import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { COMMON } from '../../styles/common';
import { MODAL } from '../../styles/modals';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={MODAL.OVERLAY}>
       <div className={`${MODAL.CONTAINER} max-w-sm`}>
         <div className="p-6">
            <div className="flex items-center mb-4 text-red-600">
               <AlertTriangle size={24} className="mr-2" />
               <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
            <div className="flex justify-end space-x-3">
               <COMMON.BUTTON.SECONDARY onClick={onCancel}>Cancel</COMMON.BUTTON.SECONDARY>
               <COMMON.BUTTON.PRIMARY_DANGER onClick={onConfirm}>
                Confirm
               </COMMON.BUTTON.PRIMARY_DANGER>
            </div>
         </div>
       </div>
    </div>
  );
};