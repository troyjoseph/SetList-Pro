import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { COMMON } from '../../styles/common';
import { SETTINGS } from '../../styles/settings';

interface SpecialMomentsSettingsProps {
  moments: string[];
  setMoments: (moments: string[]) => void;
}

export const SpecialMomentsSettings: React.FC<SpecialMomentsSettingsProps> = ({ moments, setMoments }) => {
  const [newMoment, setNewMoment] = useState('');

  const handleAdd = () => {
    if (newMoment.trim()) {
      setMoments([...moments, newMoment.trim()]);
      setNewMoment('');
    }
  };

  return (
    <div className={SETTINGS.SECTION}>
       <h3 className={SETTINGS.SECTION_HEADER}><Star size={20} className="mr-2"/> Special Moments</h3>
       <div className={SETTINGS.MOMENT_INPUT_WRAPPER}>
         <COMMON.INPUT.FLEX_BASE 
            type="text" 
            value={newMoment} 
            onChange={e => setNewMoment(e.target.value)} 
            placeholder="Add new moment type..." 
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }} 
         />
         <button onClick={handleAdd} className={SETTINGS.MOMENT_ADD_BTN}>Add</button>
       </div>
       <div className={SETTINGS.MOMENT_TAGS}>
         {moments.map((moment) => (
           <span key={moment} className={SETTINGS.MOMENT_TAG}>
             {moment}
             <button 
                onClick={() => setMoments(moments.filter(m => m !== moment))} 
                className={SETTINGS.MOMENT_CLOSE}
             >
                <X size={14} />
             </button>
           </span>
         ))}
       </div>
    </div>
  );
};