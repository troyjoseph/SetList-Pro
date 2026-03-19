import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Song, GigType, SetPreference, Singer } from '../../types';
import { StarRating } from '../Shared';
import { COMMON } from '../../styles/common';
import { MODAL } from '../../styles/modals';
import { TransitionsPanel } from './song/TransitionsPanel';
import { PreferredSingersPanel } from './song/PreferredSingersPanel';
import { BasicInfoPanel } from './song/BasicInfoPanel';
import { GigDataPanel } from './song/GigDataPanel';

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
               <BasicInfoPanel editingSong={editingSong} setEditingSong={setEditingSong} />

               <div>
                 <div className="border-b flex space-x-6 mb-4">
                   {Object.values(GigType).map(type => (
                     <button key={type} onClick={() => setActiveGigTypeTab(type)} className={MODAL.TAB_BTN(activeGigTypeTab === type)}>{type}</button>
                   ))}
                 </div>
                 {editingSong.gigData && editingSong.gigData[activeGigTypeTab] && (
                   <div className={MODAL.CONTENT_BOX}>
                      <GigDataPanel activeGigTypeTab={activeGigTypeTab} editingSong={editingSong} setEditingSong={setEditingSong} />
                      
                      <PreferredSingersPanel 
                          activeGigTypeTab={activeGigTypeTab}
                          editingSong={editingSong}
                          singers={singers}
                          singerSearch={singerSearch}
                          setSingerSearch={setSingerSearch}
                          handleAddPreferredSinger={handleAddPreferredSinger}
                          handleRemovePreferredSinger={handleRemovePreferredSinger}
                      />

                      <TransitionsPanel 
                          activeGigTypeTab={activeGigTypeTab}
                          editingSong={editingSong}
                          songs={songs}
                          transitionToSearch={transitionToSearch}
                          setTransitionToSearch={setTransitionToSearch}
                          transitionFromSearch={transitionFromSearch}
                          setTransitionFromSearch={setTransitionFromSearch}
                          handleAddTransition={handleAddTransition}
                          handleRemoveTransition={handleRemoveTransition}
                      />
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