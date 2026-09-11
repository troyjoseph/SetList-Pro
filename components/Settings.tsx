import React from 'react';
import { Song, Singer, EventDetails } from '../types';
import { COMMON } from '../styles/common';
import { SETTINGS } from '../styles/settings';
import { DataManagement } from './settings/DataManagement';
import { GlobalDefaults } from './settings/GlobalDefaults';
import { VisualPreferences } from './settings/VisualPreferences';
import { SpecialMomentsSettings } from './settings/SpecialMomentsSettings';
import { FeedbackForm } from './FeedbackForm';
import { Coffee } from 'lucide-react';

interface SettingsProps {
  appDefaults: any;
  setAppDefaults: React.Dispatch<React.SetStateAction<any>>;
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  singers: Singer[];
  setSingers: React.Dispatch<React.SetStateAction<Singer[]>>;
  events: EventDetails[];
  setEvents: React.Dispatch<React.SetStateAction<EventDetails[]>>;
  requestConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  appDefaults, 
  setAppDefaults, 
  songs, 
  setSongs, 
  singers, 
  setSingers,
  events,
  setEvents,
  requestConfirm
}) => {
    const gumroadLink = "https://troyjoseph.gumroad.com/l/setlistsharp";

    return (
    <div className={SETTINGS.CONTAINER}>
      <COMMON.TITLE className="mb-6">Settings</COMMON.TITLE>
      <div className="space-y-8">
        
        <DataManagement 
            songs={songs} 
            singers={singers} 
            events={events}
            setSongs={setSongs} 
            setSingers={setSingers} 
            setEvents={setEvents}
            requestConfirm={requestConfirm}
        />

        <GlobalDefaults 
            appDefaults={appDefaults} 
            setAppDefaults={setAppDefaults} 
        />
        
        <VisualPreferences 
            highlightColor={appDefaults.keyHighlightColor} 
            setHighlightColor={(color) => setAppDefaults({...appDefaults, keyHighlightColor: color})} 
        />

        <SpecialMomentsSettings 
            moments={appDefaults.moments} 
            setMoments={(moments) => setAppDefaults({...appDefaults, moments})} 
        />

        {/* Support Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Coffee className="mr-2 text-indigo-600" size={20} /> Support the Developer
          </h3>
          <p className="text-gray-600 mb-6">
            Enjoying Setlist♯? If you find the app helpful, consider supporting its development.
          </p>
          <a 
            href={gumroadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
          > Support us on Gumroad
          </a>
        </div>
      </div>
    </div>
  );
};
