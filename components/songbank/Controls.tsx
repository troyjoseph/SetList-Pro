import React from 'react';
import { Search } from 'lucide-react';
import { GigType } from '../../types';
import { COMMON } from '../../styles/common';
import { SONGBANK } from '../../styles/songBank';

interface ControlsProps {
  filter: string;
  setFilter: (val: string) => void;
  gigType: GigType;
  setGigType: (val: GigType) => void;
}

export const Controls: React.FC<ControlsProps> = ({ filter, setFilter, gigType, setGigType }) => (
  <div className={SONGBANK.CONTROLS.CONTAINER}>
    <COMMON.INPUT.SEARCH_WRAPPER>
      <COMMON.INPUT.SEARCH_ICON><Search size={18} /></COMMON.INPUT.SEARCH_ICON>
      <COMMON.INPUT.SEARCH_FIELD 
        type="text" 
        placeholder="Search songs or artists..." 
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
    </COMMON.INPUT.SEARCH_WRAPPER>
    
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