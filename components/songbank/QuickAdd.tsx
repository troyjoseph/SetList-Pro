import React, { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { SONGBANK } from '../../styles/songBank';

interface QuickAddProps {
  onAdd: (title: string) => void;
  isAdding: boolean;
}

export const QuickAdd: React.FC<QuickAddProps> = ({ onAdd, isAdding }) => {
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    onAdd(title);
    setTitle('');
  };

  return (
    <div className={SONGBANK.QUICK_ADD.WRAPPER}>
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
    </div>
  );
};
