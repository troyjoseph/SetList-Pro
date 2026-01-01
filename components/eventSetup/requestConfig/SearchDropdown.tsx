import React from 'react';
import { Song, RequestItem } from '../../../types';
import { EVENT_SETUP } from '../../../styles/eventSetup';

interface SearchDropdownProps {
  search: string;
  songs: Song[];
  onSelect: (item: RequestItem) => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({ search, songs, onSelect }) => {
  if (!search) return null;
  const lowerSearch = search.toLowerCase();

  // Find matching songs
  const matchingSongs = songs
    .filter(s => s.title.toLowerCase().includes(lowerSearch) || s.artist.toLowerCase().includes(lowerSearch))
    .slice(0, 3);

  // Find matching artists
  const uniqueArtists = Array.from(new Set(songs.map(s => s.artist)));
  const matchingArtists = uniqueArtists
    .filter(a => a.toLowerCase().includes(lowerSearch))
    .slice(0, 2);

  if (matchingSongs.length === 0 && matchingArtists.length === 0) return null;

  return (
    <div className={EVENT_SETUP.DROPDOWN}>
      {matchingArtists.map(artist => (
        <div 
          key={`artist-${artist}`}
          className={EVENT_SETUP.DROPDOWN_ITEM}
          onClick={() => onSelect({ type: 'ARTIST', value: artist, label: artist })}
        >
          <span className={EVENT_SETUP.DROPDOWN_TYPE_LABEL}>Artist:</span> {artist}
        </div>
      ))}
      
      {matchingSongs.map(song => (
        <div 
          key={`song-${song.id}`}
          className={EVENT_SETUP.DROPDOWN_ITEM}
          onClick={() => onSelect({ type: 'SONG', value: song.id, label: song.title })}
        >
           <span className={EVENT_SETUP.DROPDOWN_TYPE_LABEL}>Song:</span> {song.title} 
           <span className={EVENT_SETUP.DROPDOWN_SUB}>- {song.artist}</span>
        </div>
      ))}
    </div>
  );
};