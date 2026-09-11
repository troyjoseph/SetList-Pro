import React from 'react';
import { Check, Search } from 'lucide-react';
import { Song, Singer } from '../../../types';
import { COMMON } from '../../../styles/common';
import { MODAL } from '../../../styles/modals';

interface RepertoireListPanelProps {
    songs: Song[];
    editingSinger: Partial<Singer>;
    repertoireSearch: string;
    setRepertoireSearch: (s: string) => void;
    toggleSongInRepertoire: (song: Song) => void;
    updateRepertoireKey: (sid: string, k: string) => void;
    updateRepertoireNote: (sid: string, n: string) => void;
}

export const RepertoireListPanel: React.FC<RepertoireListPanelProps> = ({
    songs,
    editingSinger,
    repertoireSearch,
    setRepertoireSearch,
    toggleSongInRepertoire,
    updateRepertoireKey,
    updateRepertoireNote
}) => {
    return (
        <>
            <COMMON.INPUT.SEARCH_WRAPPER className="mb-2">
                <COMMON.INPUT.SEARCH_ICON><Search size={16} /></COMMON.INPUT.SEARCH_ICON>
                <COMMON.INPUT.SEARCH_FIELD type="text" placeholder="Search... (Try 'Show: Selected' to see only their list)" value={repertoireSearch} onChange={e => setRepertoireSearch(e.target.value)} />
            </COMMON.INPUT.SEARCH_WRAPPER>
            <div className={MODAL.LIST.CONTAINER}>
                {[...songs]
                    .sort((a, b) => {
                        const aInRepertoire = editingSinger.repertoire && editingSinger.repertoire[a.id] ? 1 : 0;
                        const bInRepertoire = editingSinger.repertoire && editingSinger.repertoire[b.id] ? 1 : 0;
                        if (aInRepertoire !== bInRepertoire) {
                            return bInRepertoire - aInRepertoire;
                        }
                        const artistCompare = a.artist.localeCompare(b.artist);
                        if (artistCompare !== 0) return artistCompare;
                        return a.title.localeCompare(b.title);
                    })
                    .filter(s => s.title.toLowerCase().includes(repertoireSearch.toLowerCase()) || s.artist.toLowerCase().includes(repertoireSearch.toLowerCase()))
                    .map(song => {
                        const repItem = editingSinger.repertoire && editingSinger.repertoire[song.id];
                        const isKnown = !!repItem;
                        return (
                            <div key={song.id} className={`${MODAL.SONG_ITEM(isKnown)} flex-col items-stretch h-auto pt-2 pb-3`}>
                                <div className="flex items-start justify-between w-full h-auto px-4">
                                    <div className={`${MODAL.LIST.ITEM_CONTENT} h-auto flex-1`} onClick={() => toggleSongInRepertoire(song)}>
                                        <div className={MODAL.CHECK_BOX(isKnown)}>
                                            {isKnown && <Check size={12} className="text-white" />}
                                        </div>
                                        <div className="truncate">
                                            <div className={MODAL.LIST.TEXT_MAIN}>{song.title}</div>
                                            <div className={MODAL.LIST.TEXT_SUB}>{song.artist}</div>
                                        </div>
                                    </div>
                                    {isKnown && (
                                        <div className={MODAL.LIST.KEY_EDIT}>
                                            {repItem.key === 'OG' && (
                                                <span className={MODAL.LIST.KEY_BADGE} title={`Original Key: ${song.originalKey}`}>({song.originalKey})</span>
                                            )}
                                            <input 
                                                type="text" 
                                                value={repItem.key} 
                                                onChange={(e) => updateRepertoireKey(song.id, e.target.value)}
                                                className={MODAL.LIST.KEY_INPUT}
                                                placeholder="Key"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    )}
                                </div>
                                {isKnown && (
                                    <div className="px-4 mt-2 transition-all">
                                        <input 
                                            type="text"
                                            value={repItem.note || ''}
                                            onChange={(e) => updateRepertoireNote(song.id, e.target.value)}
                                            placeholder="Performance notes for this singer... (e.g., 'Starts on drums', 'In 6/8')"
                                            className="w-full text-[10px] bg-indigo-50/50 border-none rounded px-2 py-1.5 focus:ring-1 focus:ring-indigo-300 placeholder:text-gray-400 text-gray-700 font-medium"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>
        </>
    );
};
