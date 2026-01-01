import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Singer, Song, SpecialMoment } from '../../types';
import { COMMON } from '../../styles/common';
import { MODAL } from '../../styles/modals';
import { EVENT_SETUP } from '../../styles/eventSetup';

interface MomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  newMomentRequest: Partial<SpecialMoment>;
  setNewMomentRequest: (m: Partial<SpecialMoment>) => void;
  onAdd: () => void;
  songs: Song[];
  activeSingers: Singer[];
  appDefaults: any;
}

export const MomentModal: React.FC<MomentModalProps> = ({ isOpen, onClose, newMomentRequest, setNewMomentRequest, onAdd, songs, activeSingers, appDefaults }) => {
    const [momentSearchTerm, setMomentSearchTerm] = useState('');

    if (!isOpen) return null;

    return (
        <div className={MODAL.OVERLAY}>
          <div className={`${MODAL.CONTAINER} ${MODAL.SIZE.MD}`}>
            <div className={MODAL.HEADER}>
              <h2 className={MODAL.MOMENT.TITLE}>Add Special Moment</h2>
              <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className={MODAL.BODY_SMALL}>
              <div>
                <COMMON.LABEL>Select Song</COMMON.LABEL>
                <COMMON.INPUT.SEARCH_WRAPPER>
                    <COMMON.INPUT.SEARCH_ICON><Search size={16} /></COMMON.INPUT.SEARCH_ICON>
                    <COMMON.INPUT.SEARCH_FIELD 
                        type="text" 
                        value={momentSearchTerm} 
                        onChange={e => setMomentSearchTerm(e.target.value)}
                        placeholder="Search song..."
                    />
                    {momentSearchTerm && !newMomentRequest.songId && (
                         <div className={EVENT_SETUP.DROPDOWN}>
                            {songs.filter(s => s.title.toLowerCase().includes(momentSearchTerm.toLowerCase())).map(s => (
                                <div 
                                    key={s.id} 
                                    onClick={() => {
                                        setNewMomentRequest({...newMomentRequest, songId: s.id});
                                        setMomentSearchTerm(s.title);
                                    }}
                                    className={EVENT_SETUP.DROPDOWN_ITEM}
                                >
                                    <div className={MODAL.LIST.ITEM_TITLE}>{s.title}</div>
                                    <div className={MODAL.LIST.ITEM_SUBTITLE}>{s.artist}</div>
                                </div>
                            ))}
                         </div>
                    )}
                     {newMomentRequest.songId && (
                        <div className={MODAL.MOMENT.CHECK}>
                             <Check size={16} className={MODAL.MOMENT.CHECK_ICON}/>
                        </div>
                     )}
                </COMMON.INPUT.SEARCH_WRAPPER>
              </div>

              <div>
                <COMMON.LABEL>Moment Type</COMMON.LABEL>
                <COMMON.INPUT.SELECT 
                    value={newMomentRequest.momentName || ''} 
                    onChange={e => setNewMomentRequest({...newMomentRequest, momentName: e.target.value})}
                >
                    <option value="">-- Select Moment --</option>
                    {appDefaults.moments.map((m: string) => <option key={m} value={m}>{m}</option>)}
                </COMMON.INPUT.SELECT>
              </div>

               <div>
                <COMMON.LABEL>Assign Singer (Optional)</COMMON.LABEL>
                <COMMON.INPUT.SELECT 
                    value={newMomentRequest.assignedSingerId || ''} 
                    onChange={e => setNewMomentRequest({...newMomentRequest, assignedSingerId: e.target.value})}
                >
                    <option value="">Auto-Assign (Best Fit)</option>
                    {activeSingers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </COMMON.INPUT.SELECT>
              </div>

            </div>
            <div className={MODAL.FOOTER}>
              <button onClick={onClose} className={MODAL.MOMENT.BTN_CANCEL}>Cancel</button>
              <button onClick={onAdd} disabled={!newMomentRequest.songId} className={MODAL.MOMENT.BTN_ADD}>Add Moment</button>
            </div>
          </div>
        </div>
    );
};