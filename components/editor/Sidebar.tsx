import React, { useState } from 'react';
import { Search, Loader2, Plus, Star } from 'lucide-react';
import { Song, Singer, GigType, DragPayload } from '../../types';
import { COMMON } from '../../styles/common';
import { EDITOR } from '../../styles/editor';

interface SidebarProps {
  songs: { song: Song; singers: { singer: Singer; key: string; isPreferred: boolean }[] }[];
  activeSingers: Singer[];
  gigType: GigType;
  onAddSong: (title: string) => void;
  isAddingSong: boolean;
  onDragStart: (e: React.DragEvent, type: 'NEW', data: DragPayload) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ songs, activeSingers, gigType, onAddSong, isAddingSong, onDragStart }) => {
  const [filter, setFilter] = useState('');
  const [singerFilter, setSingerFilter] = useState('ALL');
  const [quickAdd, setQuickAdd] = useState('');

  const filteredList = songs.filter(({ song, singers }) => {
      const matchesText = song.title.toLowerCase().includes(filter.toLowerCase()) || song.artist.toLowerCase().includes(filter.toLowerCase());
      const matchesSinger = singerFilter === 'ALL' || singers.some(s => s.singer.id === singerFilter);
      return matchesText && matchesSinger;
  });

  return (
    <div className={EDITOR.SIDEBAR.CONTAINER}>
       <div className={EDITOR.SIDEBAR.HEADER}>
          <h2 className={EDITOR.SIDEBAR.TITLE}>Available Songs</h2>
          
          <COMMON.INPUT.SEARCH_WRAPPER className="mb-3">
             <COMMON.INPUT.SEARCH_ICON><Search size={16}/></COMMON.INPUT.SEARCH_ICON>
             <input 
               type="text" 
               placeholder="Search..." 
               value={filter}
               onChange={e => setFilter(e.target.value)}
               className={EDITOR.SIDEBAR.SEARCH_INPUT}
             />
          </COMMON.INPUT.SEARCH_WRAPPER>

          <select 
             value={singerFilter} 
             onChange={e => setSingerFilter(e.target.value)}
             className={EDITOR.SIDEBAR.SELECT}
          >
             <option value="ALL">All Active Singers</option>
             {activeSingers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
       </div>
       
       <div className={EDITOR.SIDEBAR.LIST}>
         <div className={EDITOR.SIDEBAR.QUICK_ADD_CONTAINER}>
           <div className={EDITOR.SIDEBAR.QUICK_ADD_WRAPPER}>
             <input 
               type="text" 
               value={quickAdd} 
               onChange={e => setQuickAdd(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && onAddSong(quickAdd)}
               placeholder="Quick add new song..."
               className={EDITOR.SIDEBAR.QUICK_ADD_INPUT}
             />
             <button 
               onClick={() => onAddSong(quickAdd)}
               disabled={isAddingSong}
               className={EDITOR.SIDEBAR.QUICK_ADD_BTN}
             >
               {isAddingSong ? <Loader2 size={16} className={EDITOR.SIDEBAR.LOADER_ICON}/> : <Plus size={16}/>}
             </button>
           </div>
         </div>

         {filteredList.map(({song, singers: songSingers}) => {
              const gigData = song.gigData[gigType];
              const defaultSinger = songSingers[0]; 

              return (
                <div 
                  key={song.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, 'NEW', { songId: song.id, singerId: defaultSinger.singer.id, key: defaultSinger.key })}
                  className={EDITOR.SIDEBAR.SONG_CARD}
                >
                   <div className={EDITOR.SIDEBAR.CARD_HEADER}>
                      <div className={EDITOR.SIDEBAR.CARD_TITLE}>{song.title}</div>
                      {gigData?.rating > 0 && (
                        <div className={EDITOR.SIDEBAR.CARD_RATING}>
                          {[...Array(gigData.rating)].map((_, i) => <Star key={i} size={10} className={COMMON.STAR.ICON(true)} />)}
                        </div>
                      )}
                   </div>
                   <div className={EDITOR.SIDEBAR.CARD_ARTIST}>{song.artist}</div>
                   <div className={EDITOR.SIDEBAR.CARD_TAGS}>
                      {songSingers.map(item => (
                         <span 
                           key={item.singer.id} 
                           className={EDITOR.SIDEBAR.CARD_TAG(item.isPreferred)}
                           title={`Key: ${item.key}`}
                         >
                            {item.singer.name.split(' ')[0]} ({item.key})
                         </span>
                      ))}
                   </div>
                </div>
              );
         })}
       </div>
    </div>
  );
};