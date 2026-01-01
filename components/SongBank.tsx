import React, { useState } from 'react';
import { Song, GigType } from '../types';
import { COMMON } from '../styles/common';
import { SONGBANK } from '../styles/songBank';
import { QuickAdd } from './songbank/QuickAdd';
import { Controls } from './songbank/Controls';
import { SongTable } from './songbank/SongTable';

interface SongBankProps {
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  onAddSong: (title: string) => void;
  onEditSong: (song: Song) => void;
  onDeleteSong: (id: string) => void;
  isAddingSong: boolean;
}

export const SongBank: React.FC<SongBankProps> = ({ songs, setSongs, onAddSong, onEditSong, onDeleteSong, isAddingSong }) => {
    const [filter, setFilter] = useState('');
    const [gigType, setGigType] = useState<GigType>(GigType.WEDDING);

    const filteredSongs = songs.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(filter.toLowerCase()) || 
                            s.artist.toLowerCase().includes(filter.toLowerCase());
      return matchesSearch;
    });

    const handleRatingChange = (songId: string, rating: number) => {
      setSongs(prev => prev.map(s => {
        if (s.id !== songId) return s;
        const updatedGigData = { ...s.gigData };
        updatedGigData[gigType].rating = rating;
        return { ...s, gigData: updatedGigData };
      }));
    };

    return (
      <COMMON.PAGE_CONTAINER>
        <COMMON.HEADER_FLEX>
           <COMMON.TITLE>Song Bank</COMMON.TITLE>
           <QuickAdd onAdd={onAddSong} isAdding={isAddingSong} />
        </COMMON.HEADER_FLEX>

        <div className={SONGBANK.TABLE_CONTAINER}>
           <Controls 
             filter={filter} 
             setFilter={setFilter} 
             gigType={gigType} 
             setGigType={setGigType} 
           />
           
           <SongTable 
             songs={filteredSongs} 
             gigType={gigType} 
             onEdit={onEditSong} 
             onDelete={onDeleteSong} 
             onRate={handleRatingChange}
           />
           
           <div className={SONGBANK.TABLE.FOOTER}>
              {filteredSongs.length} songs displayed
           </div>
        </div>
      </COMMON.PAGE_CONTAINER>
    );
};