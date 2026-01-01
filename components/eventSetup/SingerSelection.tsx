
import React from 'react';
import { Users } from 'lucide-react';
import { Singer } from '../../types';
import { EVENT_SETUP } from '../../styles/eventSetup';

interface SingerSelectionProps {
  allSingers: Singer[];
  selectedIds: string[];
  singerQuotas: Record<string, number>;
  onChange: (ids: string[]) => void;
  onQuotaChange: (id: string, quota: number | undefined) => void;
}

export const SingerSelection: React.FC<SingerSelectionProps> = ({ allSingers, selectedIds, singerQuotas, onChange, onQuotaChange }) => (
   <div className={EVENT_SETUP.SECTION_DIVIDER}>
      <h3 className={EVENT_SETUP.SECTION_HEADER}>
         <Users size={20} className="mr-2" /> Active Singers
      </h3>
      <p className="text-sm text-gray-500 mb-4">Select singers for this event. You can optionally specify a maximum number of songs for each singer. If left blank, songs will be distributed equally.</p>
      <div className={EVENT_SETUP.GRID_3}>
         {allSingers.map(singer => {
            const isSelected = selectedIds.includes(singer.id);
            const quotaValue = singerQuotas?.[singer.id] || '';

            return (
              <div key={singer.id} className={EVENT_SETUP.SINGER_CARD(isSelected)}>
                  <label className={EVENT_SETUP.SINGER_HEADER}>
                     <input 
                       type="checkbox" 
                       checked={isSelected}
                       onChange={e => {
                          const newIds = e.target.checked 
                            ? [...selectedIds, singer.id]
                            : selectedIds.filter(id => id !== singer.id);
                          onChange(newIds);
                       }}
                       className="h-4 w-4 text-indigo-600 rounded border-gray-300 mt-1"
                     />
                     <div className={EVENT_SETUP.SINGER_INFO}>
                        <div className={EVENT_SETUP.SINGER_NAME}>{singer.name}</div>
                        <div className={EVENT_SETUP.SINGER_RANGE}>{singer.range}</div>
                     </div>
                  </label>
                  
                  {isSelected && (
                     <div className={EVENT_SETUP.QUOTA_WRAPPER}>
                        <label className={EVENT_SETUP.QUOTA_LABEL}>Max Songs:</label>
                        <input 
                           type="number" 
                           min="1"
                           placeholder="Auto"
                           value={quotaValue}
                           onChange={e => {
                              const val = e.target.value ? parseInt(e.target.value) : undefined;
                              onQuotaChange(singer.id, val);
                           }}
                           className={EVENT_SETUP.QUOTA_INPUT}
                        />
                     </div>
                  )}
              </div>
            );
         })}
      </div>
   </div>
);
