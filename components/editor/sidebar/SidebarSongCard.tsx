import React from 'react';
import { Star } from 'lucide-react';
import { Song, Singer, DragPayload, GigType } from '../../../types';
import { COMMON } from '../../../styles/common';
import { EDITOR } from '../../../styles/editor';

interface SidebarSongCardProps {
  song: Song;
  singers: { singer: Singer; key: string; isPreferred: boolean; note?: string }[];
  isInSet: boolean;
  gigType: GigType;
  onDragStart: (e: React.DragEvent, type: 'NEW', data: DragPayload) => void;
  onEditSong?: (song: Song) => void;
}

export const SidebarSongCard: React.FC<SidebarSongCardProps> = ({
  song,
  singers,
  isInSet,
  gigType,
  onDragStart,
  onEditSong,
}) => {
  const preferredSinger = singers.find(s => s.isPreferred) || singers[0];
  const gigData = song.gigData[gigType];

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, 'NEW', {
        songId: song.id,
        singerId: preferredSinger?.singer.id,
        key: preferredSinger?.key,
        note: preferredSinger?.note
      })}
      className={isInSet ? EDITOR.SIDEBAR.SONG_CARD_IN_SET : EDITOR.SIDEBAR.SONG_CARD}
    >
      <div className={EDITOR.SIDEBAR.CARD_HEADER}>
        <div className="flex items-center gap-1 min-w-0 pr-2">
          {onEditSong ? (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onEditSong(song); }}
              className={EDITOR.SIDEBAR.CARD_TITLE_BTN}
              title="Edit song details"
            >
              {song.title}
            </button>
          ) : (
            <div className={EDITOR.SIDEBAR.CARD_TITLE} title={song.title}>{song.title}</div>
          )}
          {isInSet && (
            <span className={EDITOR.SIDEBAR.IN_SET_BADGE}>In Set</span>
          )}
        </div>
        {gigData && gigData.rating > 0 && (
          <div className={EDITOR.SIDEBAR.CARD_RATING}>
            {[...Array(gigData.rating)].map((_, i) => (
              <Star key={i} size={10} className={COMMON.STAR.ICON(true)} />
            ))}
          </div>
        )}
      </div>
      {onEditSong ? (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onEditSong(song); }}
          className={EDITOR.SIDEBAR.CARD_ARTIST_BTN}
          title="Edit song details"
        >
          {song.artist}
        </button>
      ) : (
        <div className={EDITOR.SIDEBAR.CARD_ARTIST}>{song.artist}</div>
      )}
      <div className={EDITOR.SIDEBAR.CARD_TAGS}>
        {singers.map(item => (
          <span
            key={item.singer.id}
            className={EDITOR.SIDEBAR.CARD_TAG(item.isPreferred)}
            title={`Key: ${item.key}${item.note ? ` (${item.note})` : ''}`}
          >
            {item.singer.name.split(' ')[0]} ({item.key})
          </span>
        ))}
      </div>
    </div>
  );
};
