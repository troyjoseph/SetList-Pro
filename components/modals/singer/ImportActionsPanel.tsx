import React, { RefObject } from 'react';
import { Sparkles, FileDown, Loader2 } from 'lucide-react';
import { COMMON } from '../../../styles/common';
import { MODAL } from '../../../styles/modals';
import { Singer } from '../../../types';

interface ImportActionsPanelProps {
    editingSinger: Partial<Singer>;
    aiFileInputRef: RefObject<HTMLInputElement>;
    fileInputRef: RefObject<HTMLInputElement>;
    isProcessingAI: boolean;
    handleImportRepertoireWithGemini: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImportRepertoire: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImportActionsPanel: React.FC<ImportActionsPanelProps> = ({
    editingSinger,
    aiFileInputRef,
    fileInputRef,
    isProcessingAI,
    handleImportRepertoireWithGemini,
    handleImportRepertoire
}) => {
    return (
        <>
            <div className={MODAL.IMPORT.WRAPPER}>
                <COMMON.LABEL>Repertoire ({Object.keys(editingSinger.repertoire || {}).length} songs)</COMMON.LABEL>
                <div className={MODAL.IMPORT.ACTIONS}>
                    <label className={MODAL.IMPORT.BTN_AI}>
                        <Sparkles size={12} className="mr-1" /> Import w/ AI
                        <input type="file" accept=".txt,.csv" ref={aiFileInputRef} onChange={handleImportRepertoireWithGemini} className="hidden" />
                    </label>
                    <label className={MODAL.IMPORT.BTN_CSV}>
                        <FileDown size={12} className="mr-1" /> Import CSV
                        <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImportRepertoire} className="hidden" />
                    </label>
                </div>
            </div>
            {isProcessingAI && (
                <div className={MODAL.IMPORT.LOADER}>
                    <Loader2 size={12} className="animate-spin mr-2"/> AI is reading your file...
                </div>
            )}
        </>
    );
};
