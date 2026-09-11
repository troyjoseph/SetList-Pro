import React from 'react';
import { Edit2, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Song, GigType } from '../../types';
import { StarRating } from '../Shared';
import { COMMON } from '../../styles/common';
import { SONGBANK } from '../../styles/songBank';

interface SongTableProps {
  songs: Song[];
  gigType: GigType;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
  onRate: (songId: string, rating: number) => void;
}

export const SongTable: React.FC<SongTableProps> = ({ songs, gigType, sortBy, sortOrder, onSort, onEdit, onDelete, onRate }) => {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <div className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-30 transition-opacity"><ArrowUpDown size={14} /></div>;
    return sortOrder === 'asc' ? 
      <div className="w-4 h-4 ml-1 text-indigo-600"><ArrowUp size={14} /></div> : 
      <div className="w-4 h-4 ml-1 text-indigo-600"><ArrowDown size={14} /></div>;
  };

  return (
    <div className={SONGBANK.TABLE.WRAPPER}>
      <table className={SONGBANK.TABLE.BASE}>
        <thead className={SONGBANK.TABLE.HEAD}>
          <tr>
            <th 
              className={`${SONGBANK.TABLE.TH} cursor-pointer group hover:bg-gray-50 transition-colors`}
              onClick={() => onSort('title')}
            >
              <div className="flex items-center">
                Song Title
                <SortIcon field="title" />
              </div>
            </th>
            <th 
              className={`${SONGBANK.TABLE.TH} hidden sm:table-cell cursor-pointer group hover:bg-gray-50 transition-colors`}
              onClick={() => onSort('artist')}
            >
              <div className="flex items-center">
                Artist
                <SortIcon field="artist" />
              </div>
            </th>
            <th className={`${SONGBANK.TABLE.TH} text-center hidden sm:table-cell`}>Key</th>
            <th className={`${SONGBANK.TABLE.TH} text-center hidden md:table-cell`}>Length</th>
            <th className={`${SONGBANK.TABLE.TH} text-center hidden lg:table-cell`}>Tags</th>
            <th className={`${SONGBANK.TABLE.TH} text-center hidden sm:table-cell`}>Rating</th>
            <th className={`${SONGBANK.TABLE.TH} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {songs.map(song => {
            const gigData = song.gigData[gigType];
            return (
              <tr key={song.id} className={SONGBANK.TABLE.ROW}>
                <td className={`${SONGBANK.TABLE.TD} font-medium text-gray-900`}>
                  <div className="flex flex-col">
                    <span>{song.title}</span>
                    <div className="sm:hidden text-xs text-gray-500 mt-1 flex flex-col gap-1">
                      <span>{song.artist}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{song.originalKey}</span>
                        <StarRating 
                          rating={gigData?.rating || 0} 
                          onChange={(r) => onRate(song.id, r)}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className={`${SONGBANK.TABLE.TD} text-gray-600 hidden sm:table-cell`}>{song.artist}</td>
                <td className={`${SONGBANK.TABLE.TD} text-center text-gray-500 font-mono hidden sm:table-cell`}>{song.originalKey}</td>
                <td className={`${SONGBANK.TABLE.TD} text-center text-gray-400 text-xs hidden md:table-cell`}>
                  {song.duration ? `${Math.floor(song.duration / 60000)}:${Math.floor((song.duration % 60000) / 1000).toString().padStart(2, '0')}` : '--'}
                </td>
                <td className={`${SONGBANK.TABLE.TD} text-center hidden lg:table-cell`}>
                  <div className={SONGBANK.TABLE.TAGS}>
                    {gigData?.isSlow && <COMMON.BADGE.SLOW>SLOW</COMMON.BADGE.SLOW>}
                    {gigData?.isDuet && <COMMON.BADGE.DUET>DUET</COMMON.BADGE.DUET>}
                  </div>
                </td>
                <td className={`${SONGBANK.TABLE.TD} text-center hidden sm:table-cell`}>
                  <div className={SONGBANK.TABLE.RATING}>
                    <StarRating 
                      rating={gigData?.rating || 0} 
                      onChange={(r) => onRate(song.id, r)}
                    />
                  </div>
                </td>
                <td className={`${SONGBANK.TABLE.TD} text-right`}>
                  <div className={SONGBANK.TABLE.ACTIONS}>
                    <COMMON.BUTTON.ICON onClick={() => onEdit(song)} type="button">
                      <Edit2 size={16} className="pointer-events-none" />
                    </COMMON.BUTTON.ICON>
                    <COMMON.BUTTON.ICON_DANGER 
                      onClick={(e) => { e.stopPropagation(); onDelete(song.id); }} 
                      type="button"
                    >
                      <Trash2 size={16} className="pointer-events-none" />
                    </COMMON.BUTTON.ICON_DANGER>
                  </div>
                </td>
              </tr>
            );
          })}
          {songs.length === 0 && (
            <tr>
              <td colSpan={7} className={SONGBANK.TABLE.EMPTY}>
                No songs found matching your filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
