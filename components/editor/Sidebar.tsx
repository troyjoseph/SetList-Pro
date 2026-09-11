import React, { useState, useMemo } from 'react';
import { Singer, Song, DragPayload, GigType, AvailableSong } from '../../types';
import { EDITOR } from '../../styles/editor';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarQuickAdd } from './sidebar/SidebarQuickAdd';
import { SidebarSongCard } from './sidebar/SidebarSongCard';

interface SidebarProps {
  songs: AvailableSong[];
  activeSingers: Singer[];
  gigType: GigType;
  onAddSong: (title: string, matchMusicBrainz?: boolean) => void;
  isAddingSong: boolean;
  onDragStart: (e: React.DragEvent, type: 'NEW', data: DragPayload) => void;
  onEditSong?: (song: Song) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  songs,
  activeSingers,
  gigType,
  onAddSong,
  isAddingSong,
  onDragStart,
  onEditSong,
}) => {
  const [filter, setFilter] = useState('');
  const [singerFilter, setSingerFilter] = useState('ALL');
  const [quickAdd, setQuickAdd] = useState('');
  const [matchMusicBrainz, setMatchMusicBrainz] = useState(false);
  const [showUsedSongs, setShowUsedSongs] = useState(false);

  // Remaining counts for each singer (only counting songs not in set)
  const singerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalAvailable = 0;

    songs.forEach(({ singers, isInSet }) => {
      if (!isInSet) {
        totalAvailable++;
        singers.forEach(s => {
          counts[s.singer.id] = (counts[s.singer.id] || 0) + 1;
        });
      }
    });

    return { counts, totalAvailable };
  }, [songs]);

  const totalUsedCount = useMemo(() => {
    return songs.filter(s => s.isInSet).length;
  }, [songs]);

  const filteredList = useMemo(() => {
    return songs.filter(({ song, singers, isInSet }) => {
      // By default, once a song is added to the set, it disappears from all singers' lists
      if (!showUsedSongs && isInSet) return false;

      const matchesText =
        song.title.toLowerCase().includes(filter.toLowerCase()) ||
        song.artist.toLowerCase().includes(filter.toLowerCase());
      const matchesSinger =
        singerFilter === 'ALL' || singers.some(s => s.singer.id === singerFilter);

      return matchesText && matchesSinger;
    });
  }, [songs, showUsedSongs, filter, singerFilter]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAdd.trim()) return;
    onAddSong(quickAdd.trim(), matchMusicBrainz);
    setQuickAdd('');
  };

  return (
    <div className={EDITOR.SIDEBAR.CONTAINER}>
      <SidebarHeader
        filter={filter}
        setFilter={setFilter}
        singerFilter={singerFilter}
        setSingerFilter={setSingerFilter}
        activeSingers={activeSingers}
        singerCounts={singerCounts}
        showUsedSongs={showUsedSongs}
        setShowUsedSongs={setShowUsedSongs}
        totalUsedCount={totalUsedCount}
      />

      <div className={EDITOR.SIDEBAR.LIST}>
        <SidebarQuickAdd
          quickAdd={quickAdd}
          setQuickAdd={setQuickAdd}
          matchMusicBrainz={matchMusicBrainz}
          setMatchMusicBrainz={setMatchMusicBrainz}
          isAddingSong={isAddingSong}
          onSubmit={handleQuickAdd}
        />

        {filteredList.map(({ song, singers, isInSet }) => {
          const songSingers =
            singerFilter === 'ALL'
              ? singers
              : singers.filter(s => s.singer.id === singerFilter);

          return (
            <SidebarSongCard
              key={song.id}
              song={song}
              singers={songSingers}
              isInSet={isInSet}
              gigType={gigType}
              onDragStart={onDragStart}
              onEditSong={onEditSong}
            />
          );
        })}

        {filteredList.length === 0 && (
          <div className={EDITOR.SIDEBAR.EMPTY_STATE}>
            {filter || singerFilter !== 'ALL'
              ? 'No matching available songs found'
              : 'All songs for active singers are currently used in the set'}
          </div>
        )}
      </div>
    </div>
  );
};
