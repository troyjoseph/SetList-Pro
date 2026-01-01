import React from 'react';
import { GripVertical, Lock, X, Star } from 'lucide-react';
import { SetListSlot, Song, Singer, DragPayload, GigType } from '../../types';
import { EDITOR } from '../../styles/editor';
import { SongRow } from './shared/SongRow';
import { SingerSelect } from './shared/SingerSelect';

interface SlotViewProps {
  slot: SetListSlot;
  index: number;
  setIndex: number;
  song: Song | undefined;
  singer: Singer | undefined;
  activeSingers: Singer[];
  gigType: GigType;
  songs: Song[];
  nextSlot: SetListSlot | undefined;
  onDragStart: (e: React.DragEvent, type: 'MOVE', data: DragPayload) => void;
  onDrop: (e: React.DragEvent, setIndex: number, slotIndex: number) => void;
  onSingerChange: (singerId: string) => void;
  onRemove: () => void;
}

export const SlotView: React.FC<SlotViewProps> = ({ 
    slot, index, setIndex, song, singer, activeSingers, gigType, songs, nextSlot,
    onDragStart, onDrop, onSingerChange, onRemove 
}) => {
    
    // Calculate Transition Badge
    let transitionBadge = null;
    if (song && nextSlot && nextSlot.songId) {
       const nextSong = songs.find(s => s.id === nextSlot.songId);
       if (nextSong) {
           const gigData = song.gigData[gigType];
           const nextGigData = nextSong.gigData[gigType];
           
           if (gigData?.goodTransitionTo?.includes(nextSong.id) || nextGigData?.goodTransitionFrom?.includes(song.id)) {
               transitionBadge = (
                   <div className={EDITOR.ROW.TRANSITION}>
                       ✨ Good Transition to {nextSong.title}
                   </div>
               );
           }
       }
    }

    const rating = song?.gigData[gigType]?.rating || 0;

    const badges = (
        <>
            {rating > 0 && (
                <div className={EDITOR.ROW.RATING_WRAPPER}>
                     {[...Array(rating)].map((_, i) => (
                        <Star key={i} size={10} className={EDITOR.ROW.STAR_ICON} />
                     ))}
                </div>
            )}
            {slot.isRequest && <span className={EDITOR.ROW.BADGE_REQ}>REQ</span>}
            {slot.locked && <span className={EDITOR.ROW.BADGE_LOCK}><Lock size={12}/></span>}
        </>
    );

    const controls = song ? (
        <>
            <SingerSelect 
                value={slot.singerId}
                onChange={onSingerChange}
                activeSingers={activeSingers}
                song={song}
                currentKey={slot.key}
                extraOption={singer ? { id: singer.id, name: singer.name } : undefined}
            />
            <button onClick={onRemove} className={EDITOR.ROW.REMOVE_BTN}>
                <X size={16} />
            </button>
        </>
    ) : null;

    return (
       <SongRow 
         title={song?.title || ''}
         subtitle={song?.artist || ''}
         leftIcon={slot.songId ? <GripVertical size={16} className={EDITOR.ROW.HANDLE_ICON}/> : <span className={EDITOR.ROW.INDEX_TEXT}>{index + 1}</span>}
         rightControls={controls}
         badges={badges}
         extraContent={transitionBadge}
         isEmpty={!slot.songId}
         emptyText="Empty Slot"
         draggable={!!slot.songId}
         onDragStart={e => onDragStart(e, 'MOVE', { setIndex, slotIndex: index })}
         onDragOver={e => e.preventDefault()}
         onDrop={e => onDrop(e, setIndex, index)}
       />
    );
};