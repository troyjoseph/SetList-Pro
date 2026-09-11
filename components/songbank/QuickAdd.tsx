import React, { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { SONGBANK } from '../../styles/songBank';

interface QuickAddProps {
  onAdd: (title: string, matchMusicBrainz: boolean) => void;
  isAdding: boolean;
}

export const QuickAdd: React.FC<QuickAddProps> = ({ onAdd, isAdding }) => {
  const [title, setTitle] = useState('');
  const [matchMusicBrainz, setMatchMusicBrainz] = useState(false);

  const handleAdd = () => {
    onAdd(title, matchMusicBrainz);
    setTitle('');
  };

  return (
    <div className={SONGBANK.QUICK_ADD.WRAPPER}>
      <div className="flex flex-col gap-2">
        <div className={SONGBANK.QUICK_ADD.INPUT_WRAPPER}>
          <input 
            type="text" 
            placeholder="Quick add title..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className={SONGBANK.QUICK_ADD.INPUT}
          />
          <button 
            onClick={handleAdd}
            disabled={isAdding}
            className={SONGBANK.QUICK_ADD.BUTTON}
          >
            {isAdding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input 
            type="checkbox" 
            checked={matchMusicBrainz} 
            onChange={(e) => setMatchMusicBrainz(e.target.checked)} 
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          Match against MusicBrainz
        </label>
      </div>
    </div>
  );
};
