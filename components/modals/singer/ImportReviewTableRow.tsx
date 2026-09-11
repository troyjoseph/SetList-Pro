import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { PendingImportItem } from '../ImportReview';
import { MODAL } from '../../../styles/modals';

import { CanonicalMetadata } from '../../../services/musicBrainzService';

interface ImportReviewTableRowProps {
    item: PendingImportItem;
    index: number;
    onUpdateItem: (id: string, field: 'singerKey' | 'originalKey' | 'title' | 'artist' | 'note', value: string) => void;
    onRejectMatch: (id: string) => void;
    onSelectMatch: (tempId: string, match: CanonicalMetadata) => void;
}

export const ImportReviewTableRow: React.FC<ImportReviewTableRowProps> = ({ item, index, onUpdateItem, onRejectMatch, onSelectMatch }) => {
    const [showMatchSelector, setShowMatchSelector] = React.useState(false);

    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className={`${MODAL.REVIEW.TD} relative`}>
                {item.isNew ? (
                    <div className="flex flex-col gap-1">
                        <span className={MODAL.REVIEW.BADGE_NEW}>New</span>
                        {item.potentialMatches && item.potentialMatches.length > 0 && (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowMatchSelector(!showMatchSelector)}
                                    className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded hover:bg-purple-200 transition-colors flex items-center gap-1"
                                >
                                    <Sparkles size={10} />
                                    {item.potentialMatches.length} Matches
                                </button>

                                {/* Match Selector Dropdown */}
                                {showMatchSelector && item.potentialMatches && (
                                    <div className="absolute left-0 top-full z-[100] mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl w-[90vw] sm:w-[450px] max-h-[400px] overflow-y-auto p-3 ring-1 ring-black/5">
                                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                                            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Select Correct Recording</div>
                                            <button onClick={() => setShowMatchSelector(false)} className="text-gray-400 hover:text-gray-600">
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {item.potentialMatches.map((match, mIdx) => (
                                                <button
                                                    key={mIdx}
                                                    onClick={() => {
                                                        onSelectMatch(item.tempId, match);
                                                        setShowMatchSelector(false);
                                                    }}
                                                    className="w-full text-left p-2.5 hover:bg-purple-50 rounded-md transition-all border border-transparent hover:border-purple-200 group"
                                                >
                                                    <div className="flex justify-between items-start gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-700">{match.title}</div>
                                                            <div className="text-xs text-gray-600 truncate">{match.artist}</div>
                                                            {match.disambiguation && (
                                                                <div className="text-[10px] text-gray-400 italic mt-0.5 bg-gray-50 px-1 py-0.5 rounded inline-block">{match.disambiguation}</div>
                                                            )}
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            {match.key ? (
                                                                <div className="text-xs font-mono text-white font-bold bg-purple-600 px-2 py-0.5 rounded shadow-sm">Key: {match.key}</div>
                                                            ) : (
                                                                <div className="text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">No Key</div>
                                                            )}
                                                            <div className="text-[9px] text-gray-400 mt-0.5">Match: {match.score}%</div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
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
                {item.isNew ? (
                    <div className="flex flex-col gap-1">
                        <input 
                            type="text"
                            value={item.title}
                            onChange={(e) => onUpdateItem(item.tempId, 'title', e.target.value)}
                            className={MODAL.REVIEW.INPUT_WIDE}
                        />
                        <div className="flex items-center gap-2 mt-1">
                            <input 
                                type="text"
                                value={item.note || ''}
                                onChange={(e) => onUpdateItem(item.tempId, 'note', e.target.value)}
                                className="text-[10px] bg-purple-50 border-none rounded px-1.5 py-0.5 w-full italic text-purple-700 placeholder:text-purple-300"
                                placeholder="Add singer-specific note..."
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="font-medium text-gray-900 truncate max-w-[200px]" title={item.title}>
                            {item.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <input 
                                type="text"
                                value={item.note || ''}
                                onChange={(e) => onUpdateItem(item.tempId, 'note', e.target.value)}
                                className="text-[10px] bg-purple-50 border-none rounded px-1.5 py-0.5 w-full italic text-purple-700 placeholder:text-purple-300"
                                placeholder="Add singer-specific note..."
                            />
                        </div>
                        {item.matchedTitle && (
                            <div className="text-xs text-gray-500 truncate max-w-[200px]" title={`Matched to: ${item.matchedTitle}`}>
                                ↳ {item.matchedTitle}
                            </div>
                        )}
                    </>
                )}
            </td>
            <td className={MODAL.REVIEW.TD}>
                {item.isNew ? (
                    <input 
                        type="text"
                        value={item.artist}
                        onChange={(e) => onUpdateItem(item.tempId, 'artist', e.target.value)}
                        className={MODAL.REVIEW.INPUT_WIDE}
                    />
                ) : (
                    <>
                        <div className="text-gray-500 truncate max-w-[150px]" title={item.artist}>
                            {item.artist}
                        </div>
                        {item.matchedArtist && (
                            <div className="text-xs text-gray-400 truncate max-w-[150px]" title={`Matched to: ${item.matchedArtist}`}>
                                ↳ {item.matchedArtist}
                            </div>
                        )}
                    </>
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
                        <div className="text-gray-500 font-mono text-xs">
                            {item.originalKey}
                        </div>
                        {(item.matchedKey || item.originalKey) && (
                            <div className="text-gray-900 font-bold font-mono text-sm" title={`Matched Key: ${item.matchedKey || item.originalKey}`}>
                                ↳ {item.matchedKey || item.originalKey}
                            </div>
                        )}
                    </div>
                )}
            </td>
            <td className={MODAL.REVIEW.TD}>
                <input 
                    type="text"
                    autoFocus={index === 0 && !item.isKeyProvided}
                    value={item.singerKey}
                    onChange={(e) => onUpdateItem(item.tempId, 'singerKey', e.target.value)}
                    className={MODAL.REVIEW.INPUT}
                />
            </td>
        </tr>
    );
};
