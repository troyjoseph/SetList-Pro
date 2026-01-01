import React from 'react';
import { Music, X } from 'lucide-react';
import { SpecialMoment, Song, Singer } from '../../types';
import { EDITOR } from '../../styles/editor';
import { SongRow } from './shared/SongRow';
import { SingerSelect } from './shared/SingerSelect';

interface MomentItemProps {
  moment: SpecialMoment;
  song: Song | undefined;
  activeSingers: Singer[];
  allSingers: Singer[];
  onUpdateSinger: (singerId: string) => void;
  onRemove: () => void;
}

export const MomentItem: React.FC<MomentItemProps> = ({ moment, song, activeSingers, allSingers, onUpdateSinger, onRemove }) => {
    let currentKey = song?.originalKey || '';
    if (moment.assignedSingerId && song) {
       const assignedSinger = allSingers.find(s => s.id === moment.assignedSingerId);
       if (assignedSinger && assignedSinger.repertoire[song.id]) {
           const repKey = assignedSinger.repertoire[song.id];
           currentKey = repKey === 'OG' ? song.originalKey : repKey;
       }
    }

    return (
        <SongRow 
            title={song?.title || 'Unknown Song'}
            subtitle={`${moment.momentName} • ${song?.artist || ''}`}
            leftIcon={<div className={EDITOR.ROW.ICON_BOX}><Music size={16}/></div>}
            rightControls={
                <>
                  {song && (
                    <SingerSelect 
                        value={moment.assignedSingerId || ''}
                        onChange={onUpdateSinger}
                        activeSingers={activeSingers}
                        song={song}
                        currentKey={currentKey}
                        includeAuto={true}
                    />
                  )}
                  <button onClick={onRemove} className={EDITOR.ROW.REMOVE_BTN}>
                    <X size={16}/>
                  </button>
                </>
            }
        />
    );
};
