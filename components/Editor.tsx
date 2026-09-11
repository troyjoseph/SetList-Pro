import React, { useMemo, useState } from 'react';
import { Plus, Menu, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { EventDetails, Song, Singer, DragPayload, ViewState, SetListSlot, AvailableSong } from '../types';
import { EDITOR } from '../styles/editor';
import { Sidebar } from './editor/Sidebar';
import { Toolbar } from './editor/Toolbar';
import { SingerTally } from './editor/SingerTally';
import { MomentsPanel } from './editor/MomentsPanel';
import { SetView } from './editor/SetView';

interface EditorProps {
  event: EventDetails;
  setEvent: (e: EventDetails) => void;
  songs: Song[];
  activeSingers: Singer[];
  allSingers: Singer[];
  onAutoFill: () => void;
  onExport: () => void;
  onViewChange: (v: ViewState) => void;
  onAddSong: (title: string, matchMusicBrainz?: boolean) => void;
  isAddingSong: boolean;
  onOpenMomentModal: () => void;
  onOpenAppSidebar?: () => void;
}

export const Editor: React.FC<EditorProps> = ({ 
    event, setEvent, songs, activeSingers, allSingers,
    onAutoFill, onExport, onViewChange, onAddSong, isAddingSong, onOpenMomentModal, onOpenAppSidebar 
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    
    const availableSongs = useMemo<AvailableSong[]>(() => {
        const map = new Map<string, AvailableSong>();
        
        // Collect all song IDs currently used in sets or special moments
        const songsInSets = new Set<string>();
        event.sets?.forEach(set => {
            set.slots?.forEach(slot => {
                if (slot.songId) {
                    songsInSets.add(slot.songId);
                }
            });
        });
        event.specialMoments?.forEach(m => {
            if (m.songId) {
                songsInSets.add(m.songId);
            }
        });

        activeSingers.forEach(singer => {
            Object.entries(singer.repertoire).forEach(([songId, repItem]) => {
                const forbiddenIds = event.doNotPlay.filter(i => i.type === 'SONG').map(i => i.value);
                const forbiddenArtists = event.doNotPlay.filter(i => i.type === 'ARTIST').map(i => i.value.toLowerCase());
                
                let song = songs.find(s => s.id === songId);
                if (!song) return;
                
                if (forbiddenIds.includes(song.id)) return;
                if (forbiddenArtists.includes(song.artist.toLowerCase())) return;

                const rawKey = repItem.key;
                const resolvedKey = rawKey === 'OG' ? song.originalKey : rawKey;
                const isPreferred = resolvedKey === song.originalKey;

                if (!map.has(song.id)) {
                    map.set(song.id, { 
                        song, 
                        singers: [],
                        isInSet: songsInSets.has(song.id)
                    });
                }
                
                const entry = map.get(song.id)!;
                entry.singers.push({ singer, key: resolvedKey, isPreferred, note: repItem.note });
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
          const { songId, singerId, key, note } = payload;
          newSets[targetSetIndex].slots[targetSlotIndex] = { 
            ...newSets[targetSetIndex].slots[targetSlotIndex], 
            songId: songId || '', 
            singerId: singerId || '', 
            key: key || '',
            note: note || undefined
          };
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
            const repItem = singer.repertoire[slot.songId];
            const song = songs.find(s => s.id === slot.songId);
            if (song && repItem) {
                slot.singerId = singer.id;
                slot.key = repItem.key === 'OG' ? song.originalKey : repItem.key;
                slot.note = repItem.note || undefined;
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
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-30 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}

        <div className={`
            fixed inset-y-0 left-0 z-40 h-full transform transition-all duration-300 ease-in-out shrink-0
            md:relative
            ${isSidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full w-0 overflow-hidden'}
        `}>
            <div className="absolute top-4 right-4 md:hidden z-50">
                <button onClick={() => setIsSidebarOpen(false)} className="p-1 bg-white rounded-md shadow-sm text-gray-500 hover:text-gray-700">
                    <X size={20} />
                </button>
            </div>
            <Sidebar 
                songs={availableSongs} 
                activeSingers={activeSingers} 
                gigType={event.gigType} 
                onAddSong={onAddSong} 
                isAddingSong={isAddingSong} 
                onDragStart={handleDragStart} 
            />
        </div>

        <div className={EDITOR.CANVAS.CONTAINER}>
           <Toolbar 
             eventName={event.name} 
             gigType={event.gigType} 
             onSetup={() => onViewChange('EVENT_SETUP')} 
             onAutoFill={onAutoFill} 
             onExport={onExport} 
             onPrint={() => onViewChange('PRINT')} 
             isSidebarOpen={isSidebarOpen}
             onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
             onOpenAppSidebar={onOpenAppSidebar}
           />

           <SingerTally sets={event.sets} activeSingers={activeSingers} />

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