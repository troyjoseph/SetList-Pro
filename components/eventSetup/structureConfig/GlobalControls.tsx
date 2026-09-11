import React, { useState } from 'react';
import { SetLengthType } from '../../../types';
import { SET_STRUCTURE_STYLES } from '../../../styles/eventSetup/setStructure';
import { SET_STRUCTURE_CONSTANTS } from '../../../lib/constants/setStructure';

interface GlobalControlsProps {
  numberOfSets: number;
  setLengthType: SetLengthType;
  defaultLength: number;
  onSetCountChange: (count: number) => void;
  onTypeChange: (type: SetLengthType) => void;
  onApplyAll: (length: number) => void;
}

export const GlobalControls: React.FC<GlobalControlsProps> = ({
  numberOfSets,
  setLengthType,
  defaultLength,
  onSetCountChange,
  onTypeChange,
  onApplyAll,
}) => {
  const [quickValue, setQuickValue] = useState(defaultLength);
  const isTime = setLengthType === 'TIME';

  const handleApply = () => {
    if (quickValue > 0) {
      onApplyAll(quickValue);
    }
  };

  return (
    <div className={SET_STRUCTURE_STYLES.GLOBAL_PANEL}>
      <div className={SET_STRUCTURE_STYLES.GLOBAL_GRID}>
        <div>
          <label className={SET_STRUCTURE_STYLES.LABEL}>
            {SET_STRUCTURE_CONSTANTS.NUMBER_OF_SETS_LABEL}
          </label>
          <div className={SET_STRUCTURE_STYLES.COUNT_WRAPPER}>
            <input
              type="number"
              min="1"
              max="10"
              value={numberOfSets}
              onChange={(e) => onSetCountChange(parseInt(e.target.value) || 1)}
              className={SET_STRUCTURE_STYLES.COUNT_INPUT}
            />
          </div>
        </div>

        <div className={SET_STRUCTURE_STYLES.TYPE_CONTAINER}>
          <label className={SET_STRUCTURE_STYLES.RADIO_OPTION}>
            <input
              type="radio"
              name="setStructureType"
              checked={isTime}
              onChange={() => onTypeChange('TIME')}
              className={SET_STRUCTURE_STYLES.RADIO_INPUT}
            />
            <span>{SET_STRUCTURE_CONSTANTS.TIME_BASED_LABEL}</span>
          </label>
          <label className={SET_STRUCTURE_STYLES.RADIO_OPTION}>
            <input
              type="radio"
              name="setStructureType"
              checked={!isTime}
              onChange={() => onTypeChange('SONG_COUNT')}
              className={SET_STRUCTURE_STYLES.RADIO_INPUT}
            />
            <span>{SET_STRUCTURE_CONSTANTS.SONG_COUNT_LABEL}</span>
          </label>
        </div>
      </div>

      <div className={SET_STRUCTURE_STYLES.QUICK_APPLY_WRAPPER}>
        <span className={SET_STRUCTURE_STYLES.QUICK_APPLY_LABEL}>
          Batch update: Set default {isTime ? SET_STRUCTURE_CONSTANTS.MINUTES_UNIT : SET_STRUCTURE_CONSTANTS.SONGS_UNIT} for all sets
        </span>
        <div className={SET_STRUCTURE_STYLES.QUICK_APPLY_CONTROLS}>
          <input
            type="number"
            min="1"
            max={isTime ? 300 : 100}
            value={quickValue}
            onChange={(e) => setQuickValue(Math.max(1, parseInt(e.target.value) || 1))}
            className={SET_STRUCTURE_STYLES.QUICK_APPLY_INPUT}
          />
          <button
            type="button"
            onClick={handleApply}
            className={SET_STRUCTURE_STYLES.QUICK_APPLY_BTN}
          >
            {SET_STRUCTURE_CONSTANTS.APPLY_TO_ALL_BUTTON}
          </button>
        </div>
      </div>
    </div>
  );
};
