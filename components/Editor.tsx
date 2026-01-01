import React, { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { EventDetails, Song, Singer, DragPayload, ViewState, SetListSlot } from '../types';
import { EDITOR } from '../styles/editor';
import { Sidebar } from './editor/Sidebar';
import { Toolbar } from './editor/Toolbar';
import { MomentsPanel } from './editor/MomentsPanel';
import { SetView } from './editor/SetView';

interface EditorProps {
  event: EventDetails;
  setEvent: (e: EventDetails) => void;
  songs: Song[];
  activeSingers: Singer[];
  allSingers: Singer[];
  onAutoFill: () => void;
  onExportCSV: () => void;
  onViewChange: (v: ViewState) => void;
  onAddSong: (title: string) => void;
  isAddingSong: boolean;
  onOpenMomentModal: () => void;
}

export const Editor: React.FC<EditorProps> = ({ 
    event, setEvent, songs, activeSingers, allSingers,
    onAutoFill, onExportCSV, onViewChange, onAddSong, isAddingSong, onOpenMomentModal 
}) => {
    
    const availableSongs = useMemo(() => {
        const map = new Map<string, any>();
        
        activeSingers.forEach(singer => {
            Object.entries(singer.repertoire).forEach(([songId, rawKey]) => {
                const forbiddenIds = event.doNotPlay.filter(i => i.type === 'SONG').map(i => i.value);
                const forbiddenArtists = event.doNotPlay.filter(i => i.type === 'ARTIST').map(i => i.value.toLowerCase());
                
                let song = songs.find(s => s.id === songId);
                if (!song) return;
                
                if (forbiddenIds.includes(song.id)) return;
                if (forbiddenArtists.includes(song.artist.toLowerCase())) return;
                if (event.specialMoments.some(m => m.songId === song.id)) return;

                const resolvedKey = rawKey === 'OG' ? song.originalKey : rawKey;
                const isPreferred = resolvedKey === song.originalKey;

                if (!map.has(song.id)) {
                    map.set(song.id, { song, singers: [] });
                }
                
                const entry = map.get(song.id)!;
                entry.singers.push({ singer, key: resolvedKey, isPreferred });
            });
        });

        return Array.from(map.values()).sort((a, b) => {
            const aRating = a.song.gigData[event.gigType]?.rating || 0;
            const bRating = b.song.gigData[event.gigType]?.rating || 0;
            return bRating - aRating;
        });

    }, [activeSingers, songs, event]);

    const handleDragStart = (e: React.DragEvent, type: 'NEW' | 'MOVE', data: DragPayload) => { 
        e.dataTransfer.setData('type', type); 
        e.dataTransfer.setData('payload', JSON.stringify(data)); 
    };

    const handleDrop = (e: React.DragEvent, targetSetIndex: number, targetSlotIndex: number) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        const payloadStr = e.dataTransfer.getData('payload');
        if (!payloadStr) return;
        const payload = JSON.parse(payloadStr) as DragPayload;
        const newSets = [...event.sets];
        if (type === 'NEW') {
          const { songId, singerId, key } = payload;
          newSets[targetSetIndex].slots[targetSlotIndex] = { ...newSets[targetSetIndex].slots[targetSlotIndex], songId: songId || '', singerId: singerId || '', key: key || '' };
        } else if (type === 'MOVE') {
          const { setIndex: srcSetIdx, slotIndex: srcSlotIdx } = payload;
          if (srcSetIdx !== undefined && srcSlotIdx !== undefined) {
            const temp = newSets[targetSetIndex].slots[targetSlotIndex];
            newSets[targetSetIndex].slots[targetSlotIndex] = newSets[srcSetIdx].slots[srcSlotIdx];
            newSets[srcSetIdx].slots[srcSlotIdx] = temp;
          }
        }
        setEvent({ ...event, sets: newSets });
    };

    const handleSingerChange = (setIndex: number, slotIndex: number, newSingerId: string) => {
        const newSets = [...event.sets];
        const slot = newSets[setIndex].slots[slotIndex];
        if (!slot.songId) return;
    
        const singer = allSingers.find(s => s.id === newSingerId);
        if (singer) {
            const rawKey = singer.repertoire[slot.songId];
            const song = songs.find(s => s.id === slot.songId);
            if (song && rawKey) {
                slot.singerId = singer.id;
                slot.key = rawKey === 'OG' ? song.originalKey : rawKey;
                setEvent({ ...event, sets: newSets });
            }
        }
    };

    const handleRemoveSlot = (setIdx: number, slotIdx: number) => {
        const newSets = [...event.sets];
        newSets[setIdx].slots[slotIdx] = { id: uuidv4(), songId: '', singerId: '', key: '', isRequest: false };
        setEvent({ ...event, sets: newSets });
    };

    const updateSpecialMomentSinger = (momentId: string, singerId: string) => {
        const updatedMoments = event.specialMoments.map(m => 
          m.id === momentId ? { ...m, assignedSingerId: singerId } : m
        );
        setEvent({ ...event, specialMoments: updatedMoments });
    };

    const removeSpecialMoment = (id: string) => {
        setEvent({ ...event, specialMoments: event.specialMoments.filter(m => m.id !== id) });
    };

    const handleAddSlot = (setIndex: number) => {
        const newSets = [...event.sets];
        newSets[setIndex].slots.push({ id: uuidv4(), songId: '', singerId: '', key: '', isRequest: false });
        setEvent({...event, sets: newSets});
    };

    const handleAddSet = () => {
        const newId = event.sets.length + 1;
        const slots: SetListSlot[] = Array(5).fill(null).map(() => ({ id: uuidv4(), songId: '', singerId: '', key: '', isRequest: false }));
        setEvent({
            ...event,
            sets: [...event.sets, { id: `set-${newId}`, name: `Set ${newId}`, slots }]
        });
    };

    return (
      <div className={EDITOR.LAYOUT}>
        <Sidebar 
            songs={availableSongs} 
            activeSingers={activeSingers} 
            gigType={event.gigType} 
            onAddSong={onAddSong} 
            isAddingSong={isAddingSong} 
            onDragStart={handleDragStart} 
        />

        <div className={EDITOR.CANVAS.CONTAINER}>
           <Toolbar 
             eventName={event.name} 
             gigType={event.gigType} 
             onSetup={() => onViewChange('EVENT_SETUP')} 
             onAutoFill={onAutoFill} 
             onExport={onExportCSV} 
             onPrint={() => onViewChange('PRINT')} 
           />

           <div className={EDITOR.CANVAS.SCROLL_AREA}>
              <div className={EDITOR.CANVAS.CONTENT}>
                 
                 <MomentsPanel 
                    moments={event.specialMoments} 
                    songs={songs} 
                    allSingers={allSingers} 
                    activeSingers={activeSingers} 
                    onOpenModal={onOpenMomentModal} 
                    onUpdateSinger={updateSpecialMomentSinger} 
                    onRemove={removeSpecialMoment} 
                 />

                 {event.sets.map((set, setIndex) => (
                    <SetView 
                        key={set.id}
                        set={set}
                        index={setIndex}
                        songs={songs}
                        activeSingers={activeSingers}
                        allSingers={allSingers}
                        gigType={event.gigType}
                        onDrop={handleDrop}
                        onDragStart={handleDragStart}
                        onSingerChange={handleSingerChange}
                        onRemoveSlot={handleRemoveSlot}
                        onAddSlot={handleAddSlot}
                    />
                 ))}

                 <button onClick={handleAddSet} className={EDITOR.ADD_SET_BTN}>
                    <Plus size={24} className="mb-1"/>
                    <span>Add Another Set</span>
                 </button>

              </div>
           </div>
        </div>
      </div>
    );
};