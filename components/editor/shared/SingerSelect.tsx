import React from 'react';
import { Singer, Song } from '../../../types';
import { EDITOR } from '../../../styles/editor';

interface SingerSelectProps {
  value: string;
  onChange: (val: string) => void;
  activeSingers: Singer[];
  song: Song;
  currentKey: string;
  includeAuto?: boolean;
  extraOption?: { id: string; name: string };
}

export const SingerSelect: React.FC<SingerSelectProps> = ({ 
  value, onChange, activeSingers, song, currentKey, includeAuto, extraOption 
}) => {
  const isKeyChange = song && currentKey !== song.originalKey;

  return (
    <div className={EDITOR.ROW.SINGER_COL}>
      <div className={EDITOR.ROW.KEY_BADGE(isKeyChange)}>
         {currentKey}
      </div>
      <select 
         value={value}
         onChange={e => onChange(e.target.value)}
         className={EDITOR.ROW.SELECT}
         onClick={e => e.stopPropagation()}
      >
         {includeAuto && <option value="">Auto-Assign</option>}
         
         {activeSingers
            .filter(s => s.repertoire[song.id])
            .map(s => {
               const repKey = s.repertoire[song.id];
               const actualKey = repKey === 'OG' ? song?.originalKey : repKey;
               const isChange = song && actualKey !== song.originalKey;
               return (
                  <option key={s.id} value={s.id}>
                       {s.name.split(' ')[0]} {isChange ? 'Δ' : ''}
                  </option>
               );
         })}
         
         {/* If current value is not in active set but exists (e.g. removed singer) */}
         {extraOption && !activeSingers.find(s => s.id === extraOption.id && s.repertoire[song.id]) && (
              <option value={extraOption.id}>{extraOption.name} (?)</option>
         )}
      </select>
    </div>
  );
};
