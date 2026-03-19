import React from 'react';
import { X } from 'lucide-react';
import { Song, GigType } from '../../../types';
import { COMMON } from '../../../styles/common';
import { MODAL } from '../../../styles/modals';

interface TransitionsPanelProps {
    activeGigTypeTab: GigType;
    editingSong: Partial<Song>;
    songs: Song[];
    transitionToSearch: string;
    setTransitionToSearch: (s: string) => void;
    transitionFromSearch: string;
    setTransitionFromSearch: (s: string) => void;
    handleAddTransition: (type: 'TO' | 'FROM', songId: string) => void;
    handleRemoveTransition: (type: 'TO' | 'FROM', songId: string) => void;
}

export const TransitionsPanel: React.FC<TransitionsPanelProps> = ({
    activeGigTypeTab,
    editingSong,
    songs,
    transitionToSearch,
    setTransitionToSearch,
    transitionFromSearch,
    setTransitionFromSearch,
    handleAddTransition,
    handleRemoveTransition
}) => {
    if (!editingSong.gigData || !editingSong.gigData[activeGigTypeTab]) return null;

    return (
        <div className={MODAL.TRANSITIONS.BORDER}>
            <COMMON.LABEL className="mb-2">Transitions</COMMON.LABEL>
            <div className={MODAL.TRANSITIONS.GRID}>
                <div>
                    <h4 className={MODAL.TRANSITIONS.TITLE}>Good Transition TO (Next)</h4>
                    <div className={MODAL.TRANSITIONS.INPUT_WRAPPER}>
                        <input type="text" placeholder="Add song..." value={transitionToSearch} onChange={e => setTransitionToSearch(e.target.value)} className={MODAL.TRANSITIONS.INPUT}/>
                        {transitionToSearch && (
                            <div className={MODAL.TRANSITIONS.DROPDOWN}>
                                {songs.filter(s => s.title.toLowerCase().includes(transitionToSearch.toLowerCase())).slice(0,5).map(s => (
                                    <div key={s.id} onClick={() => handleAddTransition('TO', s.id)} className={MODAL.TRANSITIONS.ITEM}>{s.title}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={MODAL.TRANSITIONS.TAGS}>
                        {editingSong.gigData[activeGigTypeTab].goodTransitionTo.map(id => {
                            const s = songs.find(x => x.id === id);
                            return (
                                <span key={id} className={MODAL.TRANSITIONS.TAG('green')}>
                                    {s?.title || 'Unknown'} <button onClick={() => handleRemoveTransition('TO', id)} className={MODAL.TRANSITIONS.CLOSE('green')}><X size={12}/></button>
                                </span>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h4 className={MODAL.TRANSITIONS.TITLE}>Good Transition FROM (Prev)</h4>
                    <div className={MODAL.TRANSITIONS.INPUT_WRAPPER}>
                        <input type="text" placeholder="Add song..." value={transitionFromSearch} onChange={e => setTransitionFromSearch(e.target.value)} className={MODAL.TRANSITIONS.INPUT}/>
                        {transitionFromSearch && (
                            <div className={MODAL.TRANSITIONS.DROPDOWN}>
                                {songs.filter(s => s.title.toLowerCase().includes(transitionFromSearch.toLowerCase())).slice(0,5).map(s => (
                                    <div key={s.id} onClick={() => handleAddTransition('FROM', s.id)} className={MODAL.TRANSITIONS.ITEM}>{s.title}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={MODAL.TRANSITIONS.TAGS}>
                        {editingSong.gigData[activeGigTypeTab].goodTransitionFrom.map(id => {
                            const s = songs.find(x => x.id === id);
                            return (
                                <span key={id} className={MODAL.TRANSITIONS.TAG('blue')}>
                                    {s?.title || 'Unknown'} <button onClick={() => handleRemoveTransition('FROM', id)} className={MODAL.TRANSITIONS.CLOSE('blue')}><X size={12}/></button>
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
