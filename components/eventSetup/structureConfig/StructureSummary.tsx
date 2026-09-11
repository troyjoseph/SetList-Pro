import React from 'react';
import { Clock, Music, Calendar } from 'lucide-react';
import { SET_STRUCTURE_STYLES } from '../../../styles/eventSetup/setStructure';
import { SET_STRUCTURE_CONSTANTS } from '../../../lib/constants/setStructure';

interface StructureSummaryProps {
  totalSets: number;
  totalMinutes: number;
  totalSongs: number;
  isTime: boolean;
}

export const StructureSummary: React.FC<StructureSummaryProps> = ({
  totalSets,
  totalMinutes,
  totalSongs,
  isTime,
}) => {
  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  const timeFormatted = hours > 0
    ? `${hours}h ${remainingMins}m (${totalMinutes} ${SET_STRUCTURE_CONSTANTS.MINUTES_SHORT})`
    : `${totalMinutes} ${SET_STRUCTURE_CONSTANTS.MINUTES_SHORT}`;

  return (
    <div className={SET_STRUCTURE_STYLES.SUMMARY_CONTAINER}>
      <div className="flex items-center gap-2">
        <Calendar size={18} className="text-indigo-300" />
        <span className={SET_STRUCTURE_STYLES.SUMMARY_TITLE}>
          {SET_STRUCTURE_CONSTANTS.TOTAL_PLANNED_LABEL}
        </span>
      </div>

      <div className={SET_STRUCTURE_STYLES.SUMMARY_METRICS}>
        <div className={SET_STRUCTURE_STYLES.SUMMARY_METRIC_ITEM}>
          <span className={SET_STRUCTURE_STYLES.SUMMARY_METRIC_VALUE}>
            {totalSets}
          </span>
          <span className={SET_STRUCTURE_STYLES.SUMMARY_METRIC_LABEL}>
            {totalSets === 1 ? SET_STRUCTURE_CONSTANTS.SET_SINGULAR : SET_STRUCTURE_CONSTANTS.SET_PLURAL}
          </span>
        </div>

        <div className={SET_STRUCTURE_STYLES.SUMMARY_METRIC_ITEM}>
          <span className={SET_STRUCTURE_STYLES.SUMMARY_METRIC_VALUE}>
            {timeFormatted}
          </span>
          <span className={SET_STRUCTURE_STYLES.SUMMARY_METRIC_LABEL}>
            Performance Time
          </span>
        </div>

        <div className={SET_STRUCTURE_STYLES.SUMMARY_METRIC_ITEM}>
          <span className={SET_STRUCTURE_STYLES.SUMMARY_METRIC_VALUE}>
            ~{totalSongs}
          </span>
          <span className={SET_STRUCTURE_STYLES.SUMMARY_METRIC_LABEL}>
            {isTime ? 'Estimated Songs' : 'Total Songs'}
          </span>
        </div>
      </div>
    </div>
  );
};
