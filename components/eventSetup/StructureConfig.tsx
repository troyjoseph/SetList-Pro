import React, { useMemo } from 'react';
import { ListMusic, Plus } from 'lucide-react';
import { EventDetails, SetLengthType, SetStructureConfig } from '../../types';
import { EVENT_SETUP } from '../../styles/eventSetup';
import { SET_STRUCTURE_STYLES } from '../../styles/eventSetup/setStructure';
import { SET_STRUCTURE_CONSTANTS } from '../../lib/constants/setStructure';
import {
  getEffectiveSetConfigs,
  updateIndividualSetConfig,
  changeNumberOfSets,
  applyLengthToAllSets,
  calculateTotalStats,
} from '../../lib/utils/setStructure';
import { GlobalControls } from './structureConfig/GlobalControls';
import { SetRowCard } from './structureConfig/SetRowCard';
import { StructureSummary } from './structureConfig/StructureSummary';

interface StructureConfigProps {
  event: EventDetails;
  setEvent: (e: EventDetails) => void;
}

export const StructureConfig: React.FC<StructureConfigProps> = ({ event, setEvent }) => {
  const configs = useMemo(() => getEffectiveSetConfigs(event), [event]);
  const stats = useMemo(() => calculateTotalStats(event), [event]);
  const isTime = event.setLengthType === 'TIME';
  const defaultLength = isTime ? (event.minutesPerSet || 45) : (event.songsPerSet || 10);

  const handleUpdate = (index: number, updates: Partial<SetStructureConfig>) => {
    setEvent(updateIndividualSetConfig(event, index, updates));
  };

  const handleRemove = (index: number) => {
    const updated = configs.filter((_, i) => i !== index);
    setEvent({
      ...event,
      numberOfSets: updated.length,
      setConfigs: updated,
      sets: event.sets?.filter((_, i) => i !== index) || event.sets
    });
  };

  const handleAddSet = () => {
    if (configs.length >= 10) return;
    setEvent(changeNumberOfSets(event, configs.length + 1));
  };

  return (
    <div className={EVENT_SETUP.SECTION_DIVIDER}>
      <div className={SET_STRUCTURE_STYLES.CONTAINER}>
        <div className={SET_STRUCTURE_STYLES.HEADER_AREA}>
          <h3 className={SET_STRUCTURE_STYLES.SECTION_TITLE}>
            <ListMusic size={20} className={SET_STRUCTURE_STYLES.SECTION_ICON} />
            {SET_STRUCTURE_CONSTANTS.TITLE}
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            Customize length per set
          </span>
        </div>

        <GlobalControls
          numberOfSets={event.numberOfSets}
          setLengthType={event.setLengthType}
          defaultLength={defaultLength}
          onSetCountChange={(count) => setEvent(changeNumberOfSets(event, count))}
          onTypeChange={(type: SetLengthType) => setEvent({ ...event, setLengthType: type })}
          onApplyAll={(val) => setEvent(applyLengthToAllSets(event, val))}
        />

        <div className={SET_STRUCTURE_STYLES.SETS_LIST}>
          {configs.map((config, index) => (
            <SetRowCard
              key={config.id || `set-${index}`}
              index={index}
              config={config}
              isTime={isTime}
              avgSongMin={event.settings?.avgSongMin || 4}
              bufferSongs={event.settings?.bufferSongs || 0}
              canRemove={configs.length > 1}
              onUpdate={(updates) => handleUpdate(index, updates)}
              onRemove={() => handleRemove(index)}
            />
          ))}

          {configs.length < 10 && (
            <button
              type="button"
              onClick={handleAddSet}
              className={SET_STRUCTURE_STYLES.ADD_SET_BTN}
            >
              <Plus size={16} />
              <span>{SET_STRUCTURE_CONSTANTS.ADD_SET_BUTTON}</span>
            </button>
          )}
        </div>

        <StructureSummary
          totalSets={stats.count}
          totalMinutes={stats.totalMinutes}
          totalSongs={stats.totalEstimatedSongs}
          isTime={isTime}
        />
      </div>
    </div>
  );
};
