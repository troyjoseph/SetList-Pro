import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { COMMON } from '../../styles/common';
import { SETTINGS } from '../../styles/settings';

interface GlobalDefaultsProps {
  appDefaults: any;
  setAppDefaults: (defaults: any) => void;
}

export const GlobalDefaults: React.FC<GlobalDefaultsProps> = ({ appDefaults, setAppDefaults }) => (
  <div className={SETTINGS.SECTION}>
    <h3 className={SETTINGS.SECTION_HEADER}><SettingsIcon size={20} className="mr-2"/> Global Defaults</h3>
    <div className={SETTINGS.GRID}>
      <div>
        <COMMON.LABEL>Average Song Length (min)</COMMON.LABEL>
        <COMMON.INPUT.BASE 
          type="number" 
          value={appDefaults.avgSongMin} 
          onChange={e => setAppDefaults({...appDefaults, avgSongMin: parseFloat(e.target.value)})} 
        />
      </div>
      <div>
        <COMMON.LABEL>Songs Buffer Per Set</COMMON.LABEL>
        <COMMON.INPUT.BASE 
          type="number" 
          value={appDefaults.bufferSongs} 
          onChange={e => setAppDefaults({...appDefaults, bufferSongs: parseInt(e.target.value)})} 
        />
      </div>
      <div>
        <COMMON.LABEL>Max Slow Songs Per Set</COMMON.LABEL>
        <COMMON.INPUT.BASE 
          type="number" 
          value={appDefaults.maxSlowSongsPerSet} 
          onChange={e => setAppDefaults({...appDefaults, maxSlowSongsPerSet: parseInt(e.target.value)})} 
        />
      </div>
      <div>
        <COMMON.LABEL>Print: Show Times for Last N Songs</COMMON.LABEL>
        <COMMON.INPUT.BASE 
          type="number" 
          min="0"
          max="20"
          value={appDefaults.showTimestampsCount || 6} 
          onChange={e => setAppDefaults({...appDefaults, showTimestampsCount: parseInt(e.target.value)})} 
        />
      </div>
      <div className="col-span-2 flex items-center mt-2">
        <input 
          id="autoStandardize"
          type="checkbox" 
          checked={appDefaults.autoStandardizeSongs !== false} 
          onChange={e => setAppDefaults({...appDefaults, autoStandardizeSongs: e.target.checked})}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="autoStandardize" className="ml-2 text-sm font-medium text-gray-700">
          Automatically standardize new songs with MusicBrainz on import
        </label>
      </div>
    </div>
  </div>
);