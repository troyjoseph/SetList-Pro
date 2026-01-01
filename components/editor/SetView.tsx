import React from 'react';
import { Plus } from 'lucide-react';
import { EventSet, Song, Singer, DragPayload, GigType } from '../../types';
import { EDITOR } from '../../styles/editor';
import { SlotView } from './SlotView';

interface SetViewProps {
  set: EventSet;
  index: number;
  songs: Song[];
  activeSingers: Singer[];
  allSingers: Singer[];
  gigType: GigType;
  onDrop: (e: React.DragEvent, setIndex: number, slotIndex: number) => void;
  onDragStart: (e: React.DragEvent, type: 'MOVE', data: DragPayload) => void;
  onSingerChange: (setIndex: number, slotIndex: number, singerId: string) => void;
  onRemoveSlot: (setIndex: number, slotIndex: number) => void;
  onAddSlot: (setIndex: number) => void;
}

export const SetView: React.FC<SetViewProps> = ({ 
    set, index: setIndex, songs, activeSingers, allSingers, gigType,
    onDrop, onDragStart, onSingerChange, onRemoveSlot, onAddSlot
}) => {
   return (
    <div className={EDITOR.SET.CONTAINER}>
       <div className={EDITOR.SET.HEADER}>
          <h3 className={EDITOR.SET.TITLE}>{set.name}</h3>
          <span className={EDITOR.SET.SUBTITLE}>
             {set.slots.filter(s => s.songId).length} / {set.slots.length} Songs
          </span>
       </div>
       <div className={EDITOR.SET.LIST}>
          {set.slots.map((slot, slotIndex) => {
             const song = songs.find(s => s.id === slot.songId);
             const singer = allSingers.find(s => s.id === slot.singerId);
             
             return (
               <SlotView 
                 key={slot.id}
                 slot={slot}
                 index={slotIndex}
                 setIndex={setIndex}
                 song={song}
                 singer={singer}
                 activeSingers={activeSingers}
                 gigType={gigType}
                 songs={songs}
                 nextSlot={set.slots[slotIndex + 1]}
                 onDragStart={onDragStart}
                 onDrop={onDrop}
                 onSingerChange={(sid) => onSingerChange(setIndex, slotIndex, sid)}
                 onRemove={() => onRemoveSlot(setIndex, slotIndex)}
               />
             );
          })}
       </div>
       <div className={EDITOR.SET.FOOTER}>
          <button onClick={() => onAddSlot(setIndex)} className={EDITOR.SET.ADD_BTN}>
             <Plus size={12} className={EDITOR.SET.ADD_BTN_ICON}/> Add Slot
          </button>
       </div>
    </div>
   );
};