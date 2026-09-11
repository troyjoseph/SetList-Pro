import React, { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Song } from '../../../types';
import { COMMON } from '../../../styles/common';
import { MODAL } from '../../../styles/modals';

interface BasicInfoPanelProps {
    editingSong: Partial<Song>;
    setEditingSong: (s: Partial<Song>) => void;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({ editingSong, setEditingSong }) => {
    const [isSearching, setIsSearching] = useState(false);

    const handleMusicBrainzMatch = async () => {
        if (!editingSong.title) return;
        setIsSearching(true);
        try {
            const { searchMusicBrainz } = await import('../../../services/musicBrainzService');
            const results = await searchMusicBrainz(editingSong.title, editingSong.artist || '');
            if (results && results.length > 0) {
                const bestMatch = results[0];
                
                // Best-effort Title Casing
                const toTitleCase = (str: string) => {
                   const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
                   return str.split(/\s+/).map((word, index) => {
                     if (index > 0 && smallWords.test(word)) {
                       return word.toLowerCase();
                     }
                     return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                   }).join(' ');
                };

                setEditingSong({
                    ...editingSong,
                    title: toTitleCase(bestMatch.title),
                    artist: toTitleCase(bestMatch.artist),
                    originalKey: bestMatch.key || editingSong.originalKey || 'C'
                });
            }
        } catch (e) {
            console.error("MusicBrainz search failed", e);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className={MODAL.GRID_3}>
                <div className={MODAL.COL_SPAN_2}>
                    <COMMON.LABEL>Title</COMMON.LABEL>
                    <COMMON.INPUT.BASE type="text" value={editingSong.title || ''} onChange={e => setEditingSong({ ...editingSong, title: e.target.value })} />
                </div>
                <div>
                    <COMMON.LABEL>Original Key</COMMON.LABEL>
                    <COMMON.INPUT.BASE type="text" value={editingSong.originalKey || ''} onChange={e => setEditingSong({ ...editingSong, originalKey: e.target.value })} />
                </div>
                <div className={MODAL.COL_SPAN_3}>
                    <COMMON.LABEL>Artist</COMMON.LABEL>
                    <COMMON.INPUT.BASE type="text" value={editingSong.artist || ''} onChange={e => setEditingSong({ ...editingSong, artist: e.target.value })} />
                </div>
            </div>
        </div>
    );
};
