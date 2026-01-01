import React from 'react';
import { Song, Singer, EventDetails } from '../types';
import { COMMON } from '../styles/common';
import { SETTINGS } from '../styles/settings';
import { DataManagement } from './settings/DataManagement';
import { GlobalDefaults } from './settings/GlobalDefaults';
import { VisualPreferences } from './settings/VisualPreferences';
import { SpecialMomentsSettings } from './settings/SpecialMomentsSettings';

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
      </div>
    </div>
  );
};