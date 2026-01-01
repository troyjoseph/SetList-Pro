import React, { useRef } from 'react';
import { Database, Download, Upload, AlertCircle } from 'lucide-react';
import { Song, Singer, EventDetails } from '../../types';
import { COMMON } from '../../styles/common';
import { SETTINGS } from '../../styles/settings';

interface DataManagementProps {
  songs: Song[];
  singers: Singer[];
  events: EventDetails[];
  setSongs: (songs: Song[]) => void;
  setSingers: (singers: Singer[]) => void;
  setEvents: (events: EventDetails[]) => void;
  requestConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ songs, singers, events, setSongs, setSingers, setEvents, requestConfirm }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = { songs, singers, events, version: '2.0', timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `setlist_pro_full_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target?.result as string);
            let importedSongs = 0;
            let importedSingers = 0;
            let importedEvents = 0;

            if (json.songs && Array.isArray(json.songs)) {
                setSongs(json.songs);
                importedSongs = json.songs.length;
            }
            if (json.singers && Array.isArray(json.singers)) {
                setSingers(json.singers);
                importedSingers = json.singers.length;
            }
            if (json.events && Array.isArray(json.events)) {
                setEvents(json.events);
                importedEvents = json.events.length;
            }
            alert(`Database imported successfully!\nLoaded ${importedSongs} songs, ${importedSingers} singers, and ${importedEvents} events.`);
        } catch (err) {
            console.error(err);
            alert('Failed to parse the database file.');
        }
    };
    reader.readAsText(file);
  };

  const handleImportClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input immediately so change event fires even if same file selected again later
    e.target.value = '';

    requestConfirm(
        'Restore Database', 
        'Warning: Importing a database will REPLACE your current Songs, Singers, and Events. This action cannot be undone. Are you sure you want to proceed?',
        () => processImport(file)
    );
  };

  return (
    <div className={SETTINGS.DATA_BOX}>
      <h3 className={SETTINGS.DATA_HEADER}>
          <Database size={20} className="mr-2 text-indigo-600"/> Data Management
      </h3>
      <div className={SETTINGS.GRID}>
        <div className={SETTINGS.SUB_SECTION}>
            <h4 className={SETTINGS.SUB_HEADER}>Backup Database</h4>
            <p className={SETTINGS.DATA_DESC}>Export your entire Song Bank, Singers list, and Events history to a JSON file.</p>
            <COMMON.BUTTON.PRIMARY onClick={handleExport}>
                <Download size={16} className="mr-2" /> Export Full Database
            </COMMON.BUTTON.PRIMARY>
        </div>
        <div className={SETTINGS.SUB_SECTION_BORDER}>
            <h4 className={SETTINGS.SUB_HEADER}>Restore Database</h4>
            <p className={SETTINGS.DATA_DESC}>Restore your data from a backup file. <span className={SETTINGS.WARNING_TEXT}>This replaces current data.</span></p>
            <SETTINGS.FILE_INPUT_LABEL>
                <Upload size={16} className="mr-2" /> Import Database
                <input type="file" accept=".json" ref={fileInputRef} onChange={handleImportClick} className={COMMON.HIDDEN} />
            </SETTINGS.FILE_INPUT_LABEL>
        </div>
      </div>
      <div className={SETTINGS.DATA_WARNING}>
          <AlertCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
          <p>This backup includes all songs, ratings, transition data, singer repertoires, and your full event history including setlists.</p>
      </div>
    </div>
  );
};