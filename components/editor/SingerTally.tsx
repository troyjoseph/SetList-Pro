import React, { useMemo } from 'react';
import { EventSet, Singer } from '../../types';
import { EDITOR } from '../../styles/editor';

interface SingerTallyProps {
  sets: EventSet[];
  activeSingers: Singer[];
}

export const SingerTally: React.FC<SingerTallyProps> = ({ sets, activeSingers }) => {
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    sets.forEach(set => {
      set.slots.forEach(slot => {
        if (slot.songId && slot.singerId) {
          map[slot.singerId] = (map[slot.singerId] || 0) + 1;
        }
      });
    });
    return map;
  }, [sets]);

  if (activeSingers.length === 0) return null;

  return (
    <div className={EDITOR.TALLY.CONTAINER}>
      <span className={EDITOR.TALLY.LABEL}>Songs per Singer</span>
      {activeSingers.map(singer => (
        <div key={singer.id} className={EDITOR.TALLY.CHIP}>
          <span className={EDITOR.TALLY.CHIP_NAME}>{singer.name}</span>
          <span className={EDITOR.TALLY.CHIP_COUNT}>{counts[singer.id] || 0}</span>
        </div>
      ))}
    </div>
  );
};
