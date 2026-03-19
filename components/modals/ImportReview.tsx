
import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { COMMON } from '../../styles/common';
import { MODAL } from '../../styles/modals';
import { ImportReviewTableRow } from './singer/ImportReviewTableRow';

export interface PendingImportItem {
  tempId: string;
  title: string;
  artist: string;
  singerKey: string;
  originalKey: string;
  isNew: boolean;
  existingId?: string;
  isKeyProvided?: boolean;
  matchedTitle?: string;
  matchedArtist?: string;
  matchedKey?: string;
}

interface ImportReviewProps {
  items: PendingImportItem[];
  onUpdateItem: (id: string, field: 'singerKey' | 'originalKey', value: string) => void;
  onRejectMatch: (id: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onStandardize: (setProgress: (msg: string) => void) => Promise<void>;
}

export const ImportReview: React.FC<ImportReviewProps> = ({ items, onUpdateItem, onRejectMatch, onConfirm, onCancel, onStandardize }) => {
  const [progress, setProgress] = useState('');
  const [isStandardizing, setIsStandardizing] = useState(false);

  const handleStandardizeClick = async () => {
      setIsStandardizing(true);
      await onStandardize(setProgress);
      setIsStandardizing(false);
  };

  return (
    <div className={MODAL.OVERLAY}>
      <div className={`${MODAL.CONTAINER} ${MODAL.SIZE.XL} ${MODAL.SIZE.MAX_HEIGHT}`}>
        <div className={MODAL.HEADER}>
          <h2 className={MODAL.TITLE}>Review Imported Songs</h2>
        </div>
        
        <div className={MODAL.BODY}>
          <div className="flex justify-between items-start mb-4">
             <p className="text-sm text-gray-600">
                Review the songs below. Use <b>Tab</b> to move between key inputs.
                Items marked <span className="text-green-600 font-bold">New</span> will be added to the Song Bank.
             </p>
             <button 
                onClick={handleStandardizeClick} 
                disabled={isStandardizing}
                className="flex items-center text-xs bg-purple-50 text-purple-700 px-3 py-2 rounded-md hover:bg-purple-100 border border-purple-200 transition-colors disabled:opacity-50"
             >
                {isStandardizing ? <Loader2 size={14} className="animate-spin mr-2"/> : <Sparkles size={14} className="mr-2"/>}
                Standardize with MusicBrainz
             </button>
          </div>

          {progress && (
              <div className="mb-4 bg-indigo-50 text-indigo-700 px-4 py-2 rounded text-sm flex items-center">
                  <Loader2 size={14} className="animate-spin mr-2"/> {progress}
              </div>
          )}
          
          <div className={MODAL.REVIEW.TABLE_CONTAINER}>
             <table className={MODAL.REVIEW.TABLE}>
                <thead>
                   <tr>
                      <th className={MODAL.REVIEW.TH}>Status</th>
                      <th className={MODAL.REVIEW.TH}>Title</th>
                      <th className={MODAL.REVIEW.TH}>Artist</th>
                      <th className={MODAL.REVIEW.TH}>Original Key</th>
                      <th className={MODAL.REVIEW.TH}>Singer's Key</th>
                   </tr>
                </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {items.map((item, index) => (
                      <ImportReviewTableRow 
                          key={item.tempId}
                          item={item}
                          index={index}
                          onUpdateItem={onUpdateItem}
                          onRejectMatch={onRejectMatch}
                      />
                   ))}
                 </tbody>
             </table>
          </div>
        </div>

        <div className={MODAL.FOOTER}>
          <COMMON.BUTTON.SECONDARY onClick={onCancel}>
             Cancel Import
          </COMMON.BUTTON.SECONDARY>
          <COMMON.BUTTON.PRIMARY onClick={onConfirm} disabled={isStandardizing}>
             Confirm Import ({items.length} Songs)
          </COMMON.BUTTON.PRIMARY>
        </div>
      </div>
    </div>
  );
};
