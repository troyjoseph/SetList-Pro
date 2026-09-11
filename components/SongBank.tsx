import React, { useState } from 'react';
import { Song, GigType } from '../types';
import { COMMON } from '../styles/common';
import { SONGBANK } from '../styles/songBank';
import { QuickAdd } from './songbank/QuickAdd';
import { Controls } from './songbank/Controls';
import { SongTable } from './songbank/SongTable';
import { FilterModal } from './Modals';


interface SongBankProps {
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  onAddSong: (title: string, matchMusicBrainz?: boolean) => void;
  onEditSong: (song: Song) => void;
  onDeleteSong: (id: string) => void;
  isAddingSong: boolean;
}

export const SongBank: React.FC<SongBankProps> = ({ songs, setSongs, onAddSong, onEditSong, onDeleteSong, isAddingSong }) => {
    const [filter, setFilter] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [gigType, setGigType] = useState<GigType>(GigType.WEDDING);

    const [sortBy, setSortBy] = useState<string>('title');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSort = (field: string) => {
      if (sortBy === field) {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field);
        setSortOrder('asc');
      }
    };

    const parsePowerFilter = (input: string) => {
      const parts = input.split(/\s+AND\s+/i);
      const criteria: Array<(s: Song) => boolean> = [];

      parts.forEach(part => {
        const match = part.trim().match(/^(\w+)\s*(=|>|<|>=|<=)\s*(.+)$/i);
        if (match) {
          const [, key, op, val] = match;
          const normalizedKey = key.toLowerCase();
          const normalizedVal = val.trim().toLowerCase();

          criteria.push((s: Song) => {
            let targetValue: any;
            const gigData = s.gigData[gigType];

            if (normalizedKey === 'rating') {
              targetValue = gigData?.rating || 0;
              const numVal = parseFloat(normalizedVal);
              if (op === '>') return targetValue > numVal;
              if (op === '<') return targetValue < numVal;
              if (op === '>=') return targetValue >= numVal;
              if (op === '<=') return targetValue <= numVal;
              if (op === '=') return targetValue === numVal;
            } else if (normalizedKey === 'key') {
              targetValue = s.originalKey.toLowerCase();
              if (op === '=') return targetValue === normalizedVal;
            } else if (normalizedKey === 'artist') {
              targetValue = s.artist.toLowerCase();
              if (op === '=') return targetValue === normalizedVal;
              if (op === '>') return targetValue.includes(normalizedVal); // loose match for symbols
            } else if (normalizedKey === 'slow') {
              targetValue = gigData?.isSlow || false;
              if (op === '=') return targetValue === (normalizedVal === 'true');
            } else if (normalizedKey === 'duet') {
              targetValue = gigData?.isDuet || false;
              if (op === '=') return targetValue === (normalizedVal === 'true');
            }
            return true;
          });
        } else {
          // Regular text search if no operator found in this part
          criteria.push((s: Song) => 
            s.title.toLowerCase().includes(part.toLowerCase()) || 
            s.artist.toLowerCase().includes(part.toLowerCase())
          );
        }
      });

      return (s: Song) => criteria.every(fn => fn(s));
    };

    const filteredSongs = songs.filter(parsePowerFilter(filter));

    const sortedSongs = [...filteredSongs].sort((a, b) => {
      let valA: any = a[sortBy as keyof Song] || '';
      let valB: any = b[sortBy as keyof Song] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
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
             onOpenFilter={() => setIsFilterModalOpen(true)}
           />
           
           <SongTable 
             songs={sortedSongs} 
             gigType={gigType} 
             sortBy={sortBy}
             sortOrder={sortOrder}
             onSort={handleSort}
             onEdit={onEditSong} 
             onDelete={onDeleteSong} 
             onRate={handleRatingChange}
           />
           
           <div className={SONGBANK.TABLE.FOOTER}>
              {sortedSongs.length} songs displayed
           </div>
        </div>

        <FilterModal 
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          currentFilter={filter}
          onApply={setFilter}
        />
      </COMMON.PAGE_CONTAINER>
    );
};