import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Song, GigType, SetPreference, Singer } from '../../types';
import { StarRating } from '../Shared';
import { COMMON } from '../../styles/common';
import { MODAL } from '../../styles/modals';

interface SongModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSong: Partial<Song>;
  setEditingSong: (s: Partial<Song>) => void;
  onSave: () => void;
  activeGigTypeTab: GigType;
  setActiveGigTypeTab: (t: GigType) => void;
  songs: Song[];
  singers: Singer[];
}

export const SongModal: React.FC<SongModalProps> = ({ isOpen, onClose, editingSong, setEditingSong, onSave, activeGigTypeTab, setActiveGigTypeTab, songs, singers }) => {
    const [transitionToSearch, setTransitionToSearch] = useState('');
    const [transitionFromSearch, setTransitionFromSearch] = useState('');
    const [singerSearch, setSingerSearch] = useState('');

    if (!isOpen) return null;

    const handleAddTransition = (type: 'TO' | 'FROM', songId: string) => {
        if (!editingSong.gigData) return;
        const gd = { ...editingSong.gigData };
        if (type === 'TO') {
            if (!gd[activeGigTypeTab].goodTransitionTo.includes(songId)) gd[activeGigTypeTab].goodTransitionTo.push(songId);
            setTransitionToSearch('');
        } else {
            if (!gd[activeGigTypeTab].goodTransitionFrom.includes(songId)) gd[activeGigTypeTab].goodTransitionFrom.push(songId);
            setTransitionFromSearch('');
        }
        setEditingSong({ ...editingSong, gigData: gd });
    };

    const handleRemoveTransition = (type: 'TO' | 'FROM', songId: string) => {
        if (!editingSong.gigData) return;
        const gd = { ...editingSong.gigData };
        if (type === 'TO') gd[activeGigTypeTab].goodTransitionTo = gd[activeGigTypeTab].goodTransitionTo.filter(id => id !== songId);
        else gd[activeGigTypeTab].goodTransitionFrom = gd[activeGigTypeTab].goodTransitionFrom.filter(id => id !== songId);
        setEditingSong({ ...editingSong, gigData: gd });
    };

    const handleAddPreferredSinger = (singerId: string) => {
        if (!editingSong.gigData) return;
        const gd = { ...editingSong.gigData };
        // Safety initialization
        if (!gd[activeGigTypeTab].preferredSingers) gd[activeGigTypeTab].preferredSingers = [];
        
        if (!gd[activeGigTypeTab].preferredSingers.includes(singerId)) {
            gd[activeGigTypeTab].preferredSingers.push(singerId);
        }
        setEditingSong({ ...editingSong, gigData: gd });
        setSingerSearch('');
    };

    const handleRemovePreferredSinger = (singerId: string) => {
        if (!editingSong.gigData) return;
        const gd = { ...editingSong.gigData };
        if (!gd[activeGigTypeTab].preferredSingers) return;
        
        gd[activeGigTypeTab].preferredSingers = gd[activeGigTypeTab].preferredSingers.filter(id => id !== singerId);
        setEditingSong({ ...editingSong, gigData: gd });
    };

    return (
        <div className={MODAL.OVERLAY}>
          <div className={`${MODAL.CONTAINER} ${MODAL.SIZE.LG} ${MODAL.SIZE.MAX_HEIGHT}`}>
            <div className={MODAL.HEADER}>
              <h2 className={MODAL.TITLE}>Edit Song Details</h2>
              <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className={MODAL.BODY}>
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

               <div>
                 <div className="border-b flex space-x-6 mb-4">
                   {Object.values(GigType).map(type => (
                     <button key={type} onClick={() => setActiveGigTypeTab(type)} className={MODAL.TAB_BTN(activeGigTypeTab === type)}>{type}</button>
                   ))}
                 </div>
                 {editingSong.gigData && editingSong.gigData[activeGigTypeTab] && (
                   <div className={MODAL.CONTENT_BOX}>
                      <div className={MODAL.FLEX_BETWEEN}>
                         <label className={MODAL.FONT_MEDIUM}>Rating for {activeGigTypeTab}</label>
                         <StarRating rating={editingSong.gigData[activeGigTypeTab].rating} onChange={(r) => { const gd = { ...editingSong.gigData }; gd![activeGigTypeTab].rating = r; setEditingSong({ ...editingSong, gigData: gd }); }} />
                      </div>
                      <div className={MODAL.CHECKBOX_WRAPPER}>
                        <label className={MODAL.CHECKBOX_LABEL}>
                          <input type="checkbox" checked={editingSong.gigData[activeGigTypeTab].isSlow} onChange={e => { const gd = { ...editingSong.gigData }; gd![activeGigTypeTab].isSlow = e.target.checked; setEditingSong({ ...editingSong, gigData: gd }); }} className={MODAL.CHECKBOX_INPUT} />
                          <span className={MODAL.CHECKBOX_TEXT}>Slow Song</span>
                        </label>
                        <label className={MODAL.CHECKBOX_LABEL}>
                          <input type="checkbox" checked={editingSong.gigData[activeGigTypeTab].isDuet} onChange={e => { const gd = { ...editingSong.gigData }; gd![activeGigTypeTab].isDuet = e.target.checked; setEditingSong({ ...editingSong, gigData: gd }); }} className={MODAL.CHECKBOX_INPUT} />
                          <span className={MODAL.CHECKBOX_TEXT}>Duet</span>
                        </label>
                      </div>
                      <div className={MODAL.GRID_COL_2}>
                        <div>
                           <label className={MODAL.SELECT_LABEL}>Preferred Set</label>
                           <select value={editingSong.gigData[activeGigTypeTab].preferredSets} onChange={e => { const gd = { ...editingSong.gigData }; gd![activeGigTypeTab].preferredSets = e.target.value as SetPreference; setEditingSong({ ...editingSong, gigData: gd }); }} className={MODAL.SELECT_INPUT}>
                              {['ANY', 'FIRST', 'FIRST_TWO', 'LAST', 'LAST_TWO'].map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                           </select>
                        </div>
                        <div>
                           <label className={MODAL.SELECT_LABEL}>Avoid Set</label>
                           <select value={editingSong.gigData[activeGigTypeTab].setsToAvoid} onChange={e => { const gd = { ...editingSong.gigData }; gd![activeGigTypeTab].setsToAvoid = e.target.value as SetPreference; setEditingSong({ ...editingSong, gigData: gd }); }} className={MODAL.SELECT_INPUT}>
                              {['ANY', 'FIRST', 'FIRST_TWO', 'LAST', 'LAST_TWO'].map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                           </select>
                        </div>
                      </div>
                      
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
                   </div>
                 )}
               </div>
            </div>
            <div className={MODAL.FOOTER}>
              <button onClick={onClose} className={COMMON.BUTTON.GHOST}>Cancel</button>
              <button onClick={onSave} className={COMMON.BUTTON.PRIMARY}>Save Changes</button>
            </div>
          </div>
        </div>
    );
};