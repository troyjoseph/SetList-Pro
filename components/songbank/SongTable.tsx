import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Song, GigType } from '../../types';
import { StarRating } from '../Shared';
import { COMMON } from '../../styles/common';
import { SONGBANK } from '../../styles/songBank';

interface SongTableProps {
  songs: Song[];
  gigType: GigType;
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
  onRate: (songId: string, rating: number) => void;
}

export const SongTable: React.FC<SongTableProps> = ({ songs, gigType, onEdit, onDelete, onRate }) => (
  <div className={SONGBANK.TABLE.WRAPPER}>
    <table className={SONGBANK.TABLE.BASE}>
      <thead className={SONGBANK.TABLE.HEAD}>
        <tr>
          <th className={SONGBANK.TABLE.TH}>Song Title</th>
          <th className={SONGBANK.TABLE.TH}>Artist</th>
          <th className={`${SONGBANK.TABLE.TH} text-center`}>Key</th>
          <th className={`${SONGBANK.TABLE.TH} text-center`}>Tags</th>
          <th className={`${SONGBANK.TABLE.TH} text-center`}>Rating</th>
          <th className={`${SONGBANK.TABLE.TH} text-right`}>Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {songs.map(song => {
          const gigData = song.gigData[gigType];
          return (
            <tr key={song.id} className={SONGBANK.TABLE.ROW}>
              <td className={`${SONGBANK.TABLE.TD} font-medium text-gray-900`}>{song.title}</td>
              <td className={`${SONGBANK.TABLE.TD} text-gray-600`}>{song.artist}</td>
              <td className={`${SONGBANK.TABLE.TD} text-center text-gray-500 font-mono`}>{song.originalKey}</td>
              <td className={`${SONGBANK.TABLE.TD} text-center`}>
                <div className={SONGBANK.TABLE.TAGS}>
                  {gigData?.isSlow && <COMMON.BADGE.SLOW>SLOW</COMMON.BADGE.SLOW>}
                  {gigData?.isDuet && <COMMON.BADGE.DUET>DUET</COMMON.BADGE.DUET>}
                </div>
              </td>
              <td className={`${SONGBANK.TABLE.TD} text-center`}>
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
            <td colSpan={6} className={SONGBANK.TABLE.EMPTY}>
              No songs found matching your filter.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);