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
}

export const RepertoireListPanel: React.FC<RepertoireListPanelProps> = ({
    songs,
    editingSinger,
    repertoireSearch,
    setRepertoireSearch,
    toggleSongInRepertoire,
    updateRepertoireKey
}) => {
    return (
        <>
            <COMMON.INPUT.SEARCH_WRAPPER className="mb-2">
                <COMMON.INPUT.SEARCH_ICON><Search size={16} /></COMMON.INPUT.SEARCH_ICON>
                <COMMON.INPUT.SEARCH_FIELD type="text" placeholder="Search to add/remove songs..." value={repertoireSearch} onChange={e => setRepertoireSearch(e.target.value)} />
            </COMMON.INPUT.SEARCH_WRAPPER>
            <div className={MODAL.LIST.CONTAINER}>
                {songs
                    .filter(s => s.title.toLowerCase().includes(repertoireSearch.toLowerCase()) || s.artist.toLowerCase().includes(repertoireSearch.toLowerCase()))
                    .map(song => {
                        const isKnown = editingSinger.repertoire && editingSinger.repertoire[song.id];
                        return (
                            <div key={song.id} className={MODAL.SONG_ITEM(!!isKnown)}>
                                <div className={MODAL.LIST.ITEM_CONTENT} onClick={() => toggleSongInRepertoire(song)}>
                                    <div className={MODAL.CHECK_BOX(!!isKnown)}>
                                        {isKnown && <Check size={12} className="text-white" />}
                                    </div>
                                    <div className="truncate">
                                        <div className={MODAL.LIST.TEXT_MAIN}>{song.title}</div>
                                        <div className={MODAL.LIST.TEXT_SUB}>{song.artist}</div>
                                    </div>
                                </div>
                                {isKnown && (
                                    <div className={MODAL.LIST.KEY_EDIT}>
                                        {editingSinger.repertoire![song.id] === 'OG' && (
                                            <span className={MODAL.LIST.KEY_BADGE} title={`Original Key: ${song.originalKey}`}>({song.originalKey})</span>
                                        )}
                                        <input 
                                            type="text" 
                                            value={editingSinger.repertoire![song.id]} 
                                            onChange={(e) => updateRepertoireKey(song.id, e.target.value)}
                                            className={MODAL.LIST.KEY_INPUT}
                                            placeholder="Key"
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
