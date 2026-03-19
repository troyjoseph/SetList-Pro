import React from 'react';
import { X } from 'lucide-react';
import { Song, GigType, Singer } from '../../../types';
import { COMMON } from '../../../styles/common';
import { MODAL } from '../../../styles/modals';

interface PreferredSingersPanelProps {
    activeGigTypeTab: GigType;
    editingSong: Partial<Song>;
    singers: Singer[];
    singerSearch: string;
    setSingerSearch: (s: string) => void;
    handleAddPreferredSinger: (singerId: string) => void;
    handleRemovePreferredSinger: (singerId: string) => void;
}

export const PreferredSingersPanel: React.FC<PreferredSingersPanelProps> = ({
    activeGigTypeTab,
    editingSong,
    singers,
    singerSearch,
    setSingerSearch,
    handleAddPreferredSinger,
    handleRemovePreferredSinger
}) => {
    if (!editingSong.gigData || !editingSong.gigData[activeGigTypeTab]) return null;

    return (
        <div className={MODAL.TRANSITIONS.BORDER}>
            <COMMON.LABEL className="mb-2">Preferred Singers (Auto-fill Priority)</COMMON.LABEL>
            <div className={MODAL.TRANSITIONS.INPUT_WRAPPER}>
                <input 
                    type="text" 
                    placeholder="Search singer to add..." 
                    value={singerSearch} 
                    onChange={e => setSingerSearch(e.target.value)} 
                    className={MODAL.TRANSITIONS.INPUT}
                />
                {singerSearch && (
                    <div className={MODAL.TRANSITIONS.DROPDOWN}>
                        {singers
                            .filter(s => s.name.toLowerCase().includes(singerSearch.toLowerCase()))
                            .filter(s => !(editingSong.gigData![activeGigTypeTab].preferredSingers || []).includes(s.id))
                            .map(s => (
                                <div key={s.id} onClick={() => handleAddPreferredSinger(s.id)} className={MODAL.TRANSITIONS.ITEM}>
                                    {s.name}
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
            <div className={MODAL.TRANSITIONS.TAGS}>
                {(editingSong.gigData[activeGigTypeTab].preferredSingers || []).map(sid => {
                    const s = singers.find(x => x.id === sid);
                    return (
                        <span key={sid} className={MODAL.TRANSITIONS.TAG('purple' as any)}>
                            {s?.name || 'Unknown'} 
                            <button onClick={() => handleRemovePreferredSinger(sid)} className={MODAL.TRANSITIONS.CLOSE('purple' as any)}>
                                <X size={12}/>
                            </button>
                        </span>
                    )
                })}
            </div>
        </div>
    );
};
