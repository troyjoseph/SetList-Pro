import React from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { EDITOR } from '../../../styles/editor';

interface SidebarQuickAddProps {
  quickAdd: string;
  setQuickAdd: (val: string) => void;
  matchMusicBrainz: boolean;
  setMatchMusicBrainz: (val: boolean) => void;
  isAddingSong: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const SidebarQuickAdd: React.FC<SidebarQuickAddProps> = ({
  quickAdd,
  setQuickAdd,
  matchMusicBrainz,
  setMatchMusicBrainz,
  isAddingSong,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className={EDITOR.SIDEBAR.QUICK_ADD_CONTAINER}>
      <div className={EDITOR.SIDEBAR.QUICK_ADD_WRAPPER}>
        <input
          type="text"
          placeholder="Quick add new song..."
          value={quickAdd}
          onChange={e => setQuickAdd(e.target.value)}
          className={EDITOR.SIDEBAR.QUICK_ADD_INPUT}
        />
        <button
          type="submit"
          disabled={!quickAdd.trim() || isAddingSong}
          className={EDITOR.SIDEBAR.QUICK_ADD_BTN}
        >
          {isAddingSong ? (
            <Loader2 size={16} className={EDITOR.SIDEBAR.LOADER_ICON} />
          ) : (
            <Plus size={16} />
          )}
        </button>
      </div>
      <div className="flex items-center gap-1.5 mt-1.5 px-0.5">
        <input
          type="checkbox"
          id="sidebarMbCheckbox"
          checked={matchMusicBrainz}
          onChange={e => setMatchMusicBrainz(e.target.checked)}
          className="w-3 h-3 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
        />
        <label htmlFor="sidebarMbCheckbox" className="text-[11px] text-gray-500 cursor-pointer select-none">
          Look up key online (MusicBrainz)
        </label>
      </div>
    </form>
  );
};
