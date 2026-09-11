import React from 'react';
import { Trash2 } from 'lucide-react';
import { SetStructureConfig } from '../../../types';
import { SET_STRUCTURE_STYLES } from '../../../styles/eventSetup/setStructure';
import { SET_STRUCTURE_CONSTANTS } from '../../../lib/constants/setStructure';
import { calculateEstimatedSongs, calculateEstimatedMinutes } from '../../../lib/utils/setStructure';

interface SetRowCardProps {
  index: number;
  config: SetStructureConfig;
  isTime: boolean;
  avgSongMin: number;
  bufferSongs: number;
  canRemove: boolean;
  onUpdate: (updates: Partial<SetStructureConfig>) => void;
  onRemove: () => void;
}

export const SetRowCard: React.FC<SetRowCardProps> = ({
  index,
  config,
  isTime,
  avgSongMin,
  bufferSongs,
  canRemove,
  onUpdate,
  onRemove,
}) => {
  const currentLength = isTime
    ? (config.targetMinutes ?? 45)
    : (config.targetSongs ?? 10);

  const estimateText = isTime
    ? `${SET_STRUCTURE_CONSTANTS.APPROX_LABEL} ${calculateEstimatedSongs(currentLength, avgSongMin, bufferSongs)} ${SET_STRUCTURE_CONSTANTS.SONGS_UNIT}`
    : `${SET_STRUCTURE_CONSTANTS.APPROX_LABEL} ${calculateEstimatedMinutes(currentLength, avgSongMin)} ${SET_STRUCTURE_CONSTANTS.MINUTES_SHORT}`;

  return (
    <div className={SET_STRUCTURE_STYLES.SET_CARD}>
      <div className={SET_STRUCTURE_STYLES.SET_CARD_LEFT}>
        <div className={SET_STRUCTURE_STYLES.SET_INDEX_BADGE}>
          {index + 1}
        </div>
        <input
          type="text"
          value={config.name}
          placeholder={`${SET_STRUCTURE_CONSTANTS.SET_SINGULAR} ${index + 1}`}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className={SET_STRUCTURE_STYLES.SET_NAME_INPUT}
        />
      </div>

      <div className={SET_STRUCTURE_STYLES.SET_CARD_RIGHT}>
        <div className={SET_STRUCTURE_STYLES.LENGTH_INPUT_WRAPPER}>
          <input
            type="number"
            min="1"
            max={isTime ? 300 : 100}
            value={currentLength}
            onChange={(e) => {
              const val = Math.max(1, parseInt(e.target.value) || 1);
              onUpdate(isTime ? { targetMinutes: val } : { targetSongs: val });
            }}
            className={SET_STRUCTURE_STYLES.LENGTH_INPUT}
          />
          <span className={SET_STRUCTURE_STYLES.UNIT_LABEL}>
            {isTime ? SET_STRUCTURE_CONSTANTS.MINUTES_UNIT : SET_STRUCTURE_CONSTANTS.SONGS_UNIT}
          </span>
        </div>

        <span className={SET_STRUCTURE_STYLES.ESTIMATE_BADGE}>
          {estimateText}
        </span>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            title={SET_STRUCTURE_CONSTANTS.REMOVE_SET_BUTTON}
            className={SET_STRUCTURE_STYLES.REMOVE_BTN}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
