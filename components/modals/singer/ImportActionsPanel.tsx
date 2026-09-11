import React, { RefObject } from 'react';
import { Sparkles, FileDown, Loader2 } from 'lucide-react';
import { COMMON } from '../../../styles/common';
import { MODAL } from '../../../styles/modals';
import { Singer } from '../../../types';

interface ImportActionsPanelProps {
    editingSinger: Partial<Singer>;
    fileInputRef: React.RefObject<HTMLInputElement>;
    isProcessingAI: boolean;
    handleUnifiedImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImportActionsPanel: React.FC<ImportActionsPanelProps> = ({
    editingSinger,
    fileInputRef,
    isProcessingAI,
    handleUnifiedImport
}) => {
    return (
        <>
            <div className={MODAL.IMPORT.WRAPPER}>
                <COMMON.LABEL>Repertoire ({Object.keys(editingSinger.repertoire || {}).length} songs)</COMMON.LABEL>
                <div className={MODAL.IMPORT.ACTIONS}>
                    <label className={`${MODAL.IMPORT.BTN_AI} cursor-pointer`}>
                        <Sparkles size={12} className="mr-1" /> Import Repertoire
                        <input 
                            type="file" 
                            accept=".txt,.csv,.pdf" 
                            ref={fileInputRef} 
                            onChange={handleUnifiedImport} 
                            className="hidden" 
                        />
                    </label>
                </div>
            </div>
            {isProcessingAI && (
                <div className={MODAL.IMPORT.LOADER}>
                    <Loader2 size={12} className="animate-spin mr-2"/> Processing your repertoire...
                </div>
            )}
        </>
    );
};
