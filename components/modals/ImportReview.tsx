import React from 'react';
import { COMMON } from '../../styles/common';
import { MODAL } from '../../styles/modals';

export interface PendingImportItem {
  tempId: string;
  title: string;
  artist: string;
  singerKey: string;
  originalKey: string;
  isNew: boolean;
  existingId?: string;
  isKeyProvided?: boolean;
}

interface ImportReviewProps {
  items: PendingImportItem[];
  onUpdateItem: (id: string, field: 'singerKey' | 'originalKey', value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ImportReview: React.FC<ImportReviewProps> = ({ items, onUpdateItem, onConfirm, onCancel }) => {
  return (
    <div className={MODAL.OVERLAY}>
      <div className={`${MODAL.CONTAINER} ${MODAL.SIZE.XL} ${MODAL.SIZE.MAX_HEIGHT}`}>
        <div className={MODAL.HEADER}>
          <h2 className={MODAL.TITLE}>Review Imported Songs</h2>
        </div>
        
        <div className={MODAL.BODY}>
          <p className="text-sm text-gray-600 mb-4">
             Review the songs below. Use <b>Tab</b> to move between key inputs.
             Items marked <span className="text-green-600 font-bold">New</span> will be added to the Song Bank.
          </p>
          
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
                      <tr key={item.tempId}>
                         <td className={MODAL.REVIEW.TD}>
                            {item.isNew ? (
                               <span className={MODAL.REVIEW.BADGE_NEW}>New</span>
                            ) : (
                               <span className={MODAL.REVIEW.BADGE_EXISTING}>Matched</span>
                            )}
                         </td>
                         <td className={MODAL.REVIEW.TD}>
                            <div className="font-medium text-gray-900 truncate max-w-[200px]" title={item.title}>
                               {item.title}
                            </div>
                         </td>
                         <td className={MODAL.REVIEW.TD}>
                            <div className="text-gray-500 truncate max-w-[150px]" title={item.artist}>
                               {item.artist}
                            </div>
                         </td>
                         <td className={MODAL.REVIEW.TD}>
                             {item.isNew ? (
                                 <input 
                                   type="text"
                                   value={item.originalKey}
                                   onChange={(e) => onUpdateItem(item.tempId, 'originalKey', e.target.value)}
                                   className={MODAL.REVIEW.INPUT}
                                 />
                             ) : (
                                 <span className="text-gray-900 font-bold font-mono ml-2">{item.originalKey}</span>
                             )}
                         </td>
                         <td className={MODAL.REVIEW.TD}>
                             {item.isKeyProvided ? (
                                <span className="text-gray-900 font-bold font-mono px-2" title="Key parsed from file">{item.singerKey}</span>
                             ) : (
                                <input 
                                  type="text"
                                  autoFocus={index === 0 && !item.isKeyProvided}
                                  value={item.singerKey}
                                  onChange={(e) => onUpdateItem(item.tempId, 'singerKey', e.target.value)}
                                  className={MODAL.REVIEW.INPUT}
                                />
                             )}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        <div className={MODAL.FOOTER}>
          <COMMON.BUTTON.SECONDARY onClick={onCancel}>
             Cancel Import
          </COMMON.BUTTON.SECONDARY>
          <COMMON.BUTTON.PRIMARY onClick={onConfirm}>
             Confirm Import ({items.length} Songs)
          </COMMON.BUTTON.PRIMARY>
        </div>
      </div>
    </div>
  );
};