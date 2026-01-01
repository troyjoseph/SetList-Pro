import React from 'react';
import { Star } from 'lucide-react';
import { SpecialMoment, Song, Singer } from '../../types';
import { EDITOR } from '../../styles/editor';
import { MomentItem } from './MomentItem';

interface MomentsPanelProps {
  moments: SpecialMoment[];
  songs: Song[];
  allSingers: Singer[];
  activeSingers: Singer[];
  onOpenModal: () => void;
  onUpdateSinger: (momentId: string, singerId: string) => void;
  onRemove: (id: string) => void;
}

export const MomentsPanel: React.FC<MomentsPanelProps> = ({ moments, songs, allSingers, activeSingers, onOpenModal, onUpdateSinger, onRemove }) => (
 <div className={EDITOR.MOMENTS.CONTAINER}>
    <div className={EDITOR.MOMENTS.HEADER}>
       <h3 className={EDITOR.MOMENTS.TITLE}><Star size={18} className="mr-2 text-purple-500"/> Special Moments</h3>
       <button onClick={onOpenModal} className={EDITOR.MOMENTS.ADD_BTN}>+ Add Moment</button>
    </div>
    {moments.length === 0 ? (
       <div className={EDITOR.MOMENTS.EMPTY}>No special moments configured.</div>
    ) : (
       <div className={EDITOR.MOMENTS.LIST}>
          {moments.map(moment => {
             const song = songs.find(s => s.id === moment.songId);
             return (
                <MomentItem
                    key={moment.id}
                    moment={moment}
                    song={song}
                    activeSingers={activeSingers}
                    allSingers={allSingers}
                    onUpdateSinger={(sid) => onUpdateSinger(moment.id, sid)}
                    onRemove={() => onRemove(moment.id)}
                />
             );
          })}
       </div>
    )}
 </div>
);
