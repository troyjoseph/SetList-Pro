import React from 'react';
import { Search, Filter } from 'lucide-react';
import { GigType } from '../../types';
import { COMMON } from '../../styles/common';
import { SONGBANK } from '../../styles/songBank';

interface ControlsProps {
  filter: string;
  setFilter: (val: string) => void;
  gigType: GigType;
  setGigType: (val: GigType) => void;
  onOpenFilter: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ filter, setFilter, gigType, setGigType, onOpenFilter }) => (
  <div className={SONGBANK.CONTROLS.CONTAINER}>
    <div className="flex-1 flex items-center gap-2">
      <COMMON.INPUT.SEARCH_WRAPPER>
        <COMMON.INPUT.SEARCH_ICON><Search size={18} /></COMMON.INPUT.SEARCH_ICON>
        <COMMON.INPUT.SEARCH_FIELD 
          type="text" 
          placeholder="Filter by title, artist or use power filter (e.g. rating > 2 AND key = Dm)..." 
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </COMMON.INPUT.SEARCH_WRAPPER>
      
      <button 
        onClick={onOpenFilter}
        className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-md border border-indigo-100 hover:bg-indigo-100 transition-colors text-sm font-medium whitespace-nowrap"
      >
        <Filter size={16} />
        Filter
      </button>
    </div>
    
    <div className="flex items-center space-x-2">
      <span className={SONGBANK.CONTROLS.LABEL}>Showing ratings for:</span>
      <select 
        value={gigType} 
        onChange={(e) => setGigType(e.target.value as GigType)}
        className={SONGBANK.CONTROLS.SELECT}
      >
        {Object.values(GigType).map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
  </div>
);