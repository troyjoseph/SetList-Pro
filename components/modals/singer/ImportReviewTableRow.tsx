import React from 'react';
import { PendingImportItem } from './ImportReview';
import { MODAL } from '../../../styles/modals';

interface ImportReviewTableRowProps {
    item: PendingImportItem;
    index: number;
    onUpdateItem: (id: string, field: 'singerKey' | 'originalKey', value: string) => void;
    onRejectMatch: (id: string) => void;
}

export const ImportReviewTableRow: React.FC<ImportReviewTableRowProps> = ({ item, index, onUpdateItem, onRejectMatch }) => {
    return (
        <tr>
            <td className={MODAL.REVIEW.TD}>
                {item.isNew ? (
                    <span className={MODAL.REVIEW.BADGE_NEW}>New</span>
                ) : (
                    <div className="flex flex-col gap-1">
                        <span className={MODAL.REVIEW.BADGE_EXISTING}>Matched</span>
                        <button 
                            onClick={() => onRejectMatch(item.tempId)}
                            className="text-[10px] text-red-600 hover:text-red-800 underline text-left"
                        >
                            Reject Match
                        </button>
                    </div>
                )}
            </td>
            <td className={MODAL.REVIEW.TD}>
                <div className="font-medium text-gray-900 truncate max-w-[200px]" title={item.title}>
                    {item.title}
                </div>
                {!item.isNew && item.matchedTitle && (
                    <div className="text-xs text-gray-500 truncate max-w-[200px]" title={`Matched to: ${item.matchedTitle}`}>
                        ↳ {item.matchedTitle}
                    </div>
                )}
            </td>
            <td className={MODAL.REVIEW.TD}>
                <div className="text-gray-500 truncate max-w-[150px]" title={item.artist}>
                    {item.artist}
                </div>
                {!item.isNew && item.matchedArtist && (
                    <div className="text-xs text-gray-400 truncate max-w-[150px]" title={`Matched to: ${item.matchedArtist}`}>
                        ↳ {item.matchedArtist}
                    </div>
                )}
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
                    <div className="flex flex-col">
                        <span className="text-gray-900 font-bold font-mono ml-2" title={`Matched Key: ${item.matchedKey || item.originalKey}`}>
                            ↳ {item.matchedKey || item.originalKey}
                        </span>
                    </div>
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
    );
};
