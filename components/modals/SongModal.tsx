import React, { useState } from 'react';
import { X, Sparkles, Search, Loader2 } from 'lucide-react';
import { Song, GigType, SetPreference, Singer } from '../../types';
import { StarRating } from '../Shared';
import { COMMON } from '../../styles/common';
import { MODAL } from '../../styles/modals';
import { TransitionsPanel } from './song/TransitionsPanel';
import { PreferredSingersPanel } from './song/PreferredSingersPanel';
import { BasicInfoPanel } from './song/BasicInfoPanel';
import { GigDataPanel } from './song/GigDataPanel';
import { searchMusicBrainz, CanonicalMetadata } from '../../services/musicBrainzService';

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
    const [isSearchingMB, setIsSearchingMB] = useState(false);
    const [mbResults, setMbResults] = useState<CanonicalMetadata[]>([]);
    const [showMbResults, setShowMbResults] = useState(false);

    if (!isOpen) return null;

    const handleSearchMB = async () => {
        if (!editingSong.title) return;
        setIsSearchingMB(true);
        try {
            const results = await searchMusicBrainz(editingSong.title, editingSong.artist || '');
            setMbResults(results);
            setShowMbResults(true);
        } catch (error) {
            console.error("MusicBrainz search failed", error);
        } finally {
            setIsSearchingMB(false);
        }
    };

    const handleSelectMBMatch = async (match: CanonicalMetadata) => {
        setEditingSong({
            ...editingSong,
            title: match.title,
            artist: match.artist,
            originalKey: match.key || editingSong.originalKey || 'C',
            duration: match.duration
        });
        setShowMbResults(false);
    };

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
               <div className="relative">
                 <BasicInfoPanel editingSong={editingSong} setEditingSong={setEditingSong} />
                 <div className="mt-2 flex justify-end">
                    <button 
                        onClick={handleSearchMB}
                        disabled={isSearchingMB || !editingSong.title}
                        className="flex items-center text-[11px] bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200 hover:bg-purple-100 transition-colors disabled:opacity-50"
                    >
                        {isSearchingMB ? <Loader2 size={12} className="animate-spin mr-1.5" /> : <Sparkles size={12} className="mr-1.5" />}
                        Match with MusicBrainz
                    </button>
                 </div>

                 {/* MusicBrainz Results Dropdown */}
                 {showMbResults && mbResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-[120px] z-[100] bg-white border border-gray-200 rounded-lg shadow-2xl max-h-[300px] overflow-y-auto p-2 ring-1 ring-black/5">
                        <div className="flex justify-between items-center mb-2 px-2 pb-1 border-b border-gray-100">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Correct Recording</div>
                            <button onClick={() => setShowMbResults(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={14} />
                            </button>
                        </div>
                        <div className="space-y-1">
                            {mbResults.map((match, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectMBMatch(match)}
                                    className="w-full text-left p-2 hover:bg-purple-50 rounded transition-colors group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-700">{match.title}</div>
                                            <div className="text-xs text-gray-500 truncate">{match.artist}</div>
                                        </div>
                                        <div className="text-right shrink-0 ml-2">
                                            {match.key && (
                                                <div className="text-[10px] font-mono font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Key: {match.key}</div>
                                            )}
                                            <div className="text-[9px] text-gray-400 mt-0.5">{match.score}% match</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                 )}
               </div>

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
              <COMMON.BUTTON.GHOST onClick={onClose}>Cancel</COMMON.BUTTON.GHOST>
              <COMMON.BUTTON.PRIMARY onClick={onSave}>Save Changes</COMMON.BUTTON.PRIMARY>
            </div>
          </div>
        </div>
    );
};