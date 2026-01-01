
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ViewState, EventDetails, Song, Singer, GigType, Range } from '../../types';
import { Dashboard } from '../Dashboard';
import { SongBank } from '../SongBank';
import { Singers } from '../Singers';
import { Settings } from '../Settings';
import { EventSetup } from '../EventSetup';
import { Editor } from '../Editor';
import { LAYOUT } from '../../styles/layout';

interface MainContentProps {
  view: ViewState;
  events: EventDetails[];
  songs: Song[];
  singers: Singer[];
  appDefaults: any;
  currentEvent: EventDetails | null;
  activeSingers: Singer[];
  
  // State Setters needed for child components
  setView: (v: ViewState) => void;
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  setSingers: React.Dispatch<React.SetStateAction<Singer[]>>;
  setEvents: React.Dispatch<React.SetStateAction<EventDetails[]>>;
  setAppDefaults: React.Dispatch<React.SetStateAction<any>>;
  setCurrentEvent: (e: EventDetails) => void;
  setActiveEventId: (id: string | null) => void;
  setEditingSong: (s: Partial<Song>) => void;
  setEditingSinger: (s: Partial<Singer>) => void;
  setActiveGigTypeTab: (t: GigType) => void;
  setIsSongModalOpen: (b: boolean) => void;
  setIsSingerModalOpen: (b: boolean) => void;
  setNewMomentRequest: (m: any) => void;
  setIsMomentModalOpen: (b: boolean) => void;

  // Actions
  isAddingSong: boolean;
  onAddSong: (title: string) => void;
  createNewEvent: () => void;
  deleteEvent: (id: string) => void;
  duplicateEvent: (id: string) => void;
  handleDeleteSong: (id: string) => void;
  handleDeleteSinger: (id: string) => void;
  requestConfirm: (t: string, m: string, cb: () => void) => void;
  handleDeleteCurrentEvent: () => void;
  handleSaveEventSetup: () => void;
  handleAutoFill: () => void;
  handleExportCSV: () => void;
}

export const MainContent: React.FC<MainContentProps> = (props) => {
  const { view, currentEvent, isAddingSong } = props;

  return (
    <LAYOUT.MAIN>
        <LAYOUT.SCROLL_AREA>
          {view === 'DASHBOARD' && (
            <Dashboard 
              events={props.events} 
              onCreateEvent={props.createNewEvent} 
              onSelectEvent={(id) => { props.setActiveEventId(id); props.setView('EDITOR'); }} 
              onDeleteEvent={props.deleteEvent}
              onDuplicateEvent={props.duplicateEvent}
            />
          )}
          {view === 'SONGBANK' && (
            <SongBank 
                songs={props.songs} 
                setSongs={props.setSongs} 
                onAddSong={props.onAddSong} 
                isAddingSong={isAddingSong} 
                onEditSong={(s) => { 
                    props.setEditingSong({...s}); 
                    props.setActiveGigTypeTab(GigType.WEDDING); 
                    props.setIsSongModalOpen(true); 
                }} 
                onDeleteSong={props.handleDeleteSong} 
            />
          )}
          {view === 'SINGERS' && (
            <Singers 
                singers={props.singers} 
                onAddSinger={() => { 
                    props.setEditingSinger({ id: uuidv4(), name: '', range: Range.UNSPECIFIED, repertoire: {} }); 
                    props.setIsSingerModalOpen(true); 
                }} 
                onEditSinger={(s) => { 
                    props.setEditingSinger(JSON.parse(JSON.stringify(s))); 
                    props.setIsSingerModalOpen(true); 
                }} 
                onDeleteSinger={props.handleDeleteSinger} 
            />
          )}
          {view === 'SETTINGS' && (
            <Settings 
                appDefaults={props.appDefaults} 
                setAppDefaults={props.setAppDefaults} 
                songs={props.songs} 
                setSongs={props.setSongs}
                singers={props.singers}
                setSingers={props.setSingers}
                events={props.events}
                setEvents={props.setEvents}
                requestConfirm={props.requestConfirm}
            />
          )}
          {view === 'EVENT_SETUP' && currentEvent && (
            <EventSetup 
                event={currentEvent} 
                setEvent={props.setCurrentEvent} 
                songs={props.songs} 
                singers={props.singers} 
                onDelete={props.handleDeleteCurrentEvent} 
                onSave={props.handleSaveEventSetup} 
            />
          )}
          {view === 'EDITOR' && currentEvent && (
            <Editor 
                event={currentEvent} 
                setEvent={props.setCurrentEvent} 
                songs={props.songs} 
                activeSingers={props.activeSingers} 
                allSingers={props.singers} 
                onAutoFill={props.handleAutoFill} 
                onExportCSV={props.handleExportCSV} 
                onViewChange={props.setView} 
                onAddSong={props.onAddSong} 
                isAddingSong={isAddingSong} 
                onOpenMomentModal={() => { 
                    props.setNewMomentRequest({ assignedSingerId: '' }); 
                    props.setIsMomentModalOpen(true); 
                }} 
            />
          )}
        </LAYOUT.SCROLL_AREA>
      </LAYOUT.MAIN>
  );
};
