import React from 'react';
import { Search } from 'lucide-react';
import { Singer } from '../../../types';
import { EDITOR } from '../../../styles/editor';

interface SidebarHeaderProps {
  filter: string;
  setFilter: (val: string) => void;
  singerFilter: string;
  setSingerFilter: (val: string) => void;
  activeSingers: Singer[];
  singerCounts: { counts: Record<string, number>; totalAvailable: number };
  showUsedSongs: boolean;
  setShowUsedSongs: (val: boolean) => void;
  totalUsedCount: number;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  filter,
  setFilter,
  singerFilter,
  setSingerFilter,
  activeSingers,
  singerCounts,
  showUsedSongs,
  setShowUsedSongs,
  totalUsedCount,
}) => {
  return (
    <div className={EDITOR.SIDEBAR.HEADER}>
      <div className="flex items-center justify-between mb-3">
        <h2 className={EDITOR.SIDEBAR.TITLE}>Available Songs</h2>
        <span className="text-xs text-gray-400 font-medium">
          {singerCounts.totalAvailable} remaining
        </span>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search available songs..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className={EDITOR.SIDEBAR.SEARCH_INPUT}
          />
        </div>

        <select
          value={singerFilter}
          onChange={e => setSingerFilter(e.target.value)}
          className={EDITOR.SIDEBAR.SELECT}
        >
          <option value="ALL">
            All Active Singers ({singerCounts.totalAvailable})
          </option>
          {activeSingers.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} ({singerCounts.counts[s.id] || 0})
            </option>
          ))}
        </select>

        {totalUsedCount > 0 && (
          <label className={EDITOR.SIDEBAR.SHOW_USED_TOGGLE}>
            <input
              type="checkbox"
              checked={showUsedSongs}
              onChange={e => setShowUsedSongs(e.target.checked)}
              className={EDITOR.SIDEBAR.CHECKBOX}
            />
            <span>Show songs already in set ({totalUsedCount})</span>
          </label>
        )}
      </div>
    </div>
  );
};
