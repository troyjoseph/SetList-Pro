
import React, { useState, useRef } from 'react';
import { X, Sparkles, FileDown, Loader2, Search, Check } from 'lucide-react';
import { Singer, Song, Range } from '../../types';
import { parseRepertoireText } from '../../services/geminiService';
import { searchMusicBrainz } from '../../services/musicBrainzService';
import { v4 as uuidv4 } from 'uuid';
import { createGigData } from '../../constants';
import { COMMON } from '../../styles/common';
import { MODAL } from '../../styles/modals';
import { ImportReview, PendingImportItem } from './ImportReview';

interface SingerModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSinger: Partial<Singer>;
  setEditingSinger: (s: Partial<Singer>) => void;
  onSave: () => void;
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
}

export const SingerModal: React.FC<SingerModalProps> = ({ isOpen, onClose, editingSinger, setEditingSinger, onSave, songs, setSongs }) => {
    const [repertoireSearch, setRepertoireSearch] = useState('');
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [pendingImports, setPendingImports] = useState<PendingImportItem[]>([]);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const aiFileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const toggleSongInRepertoire = (song: Song) => {
        if (!editingSinger.repertoire) return;
        const nr = { ...editingSinger.repertoire };
        if (nr[song.id]) {
            delete nr[song.id];
        } else {
            nr[song.id] = 'OG'; 
        }
        setEditingSinger({ ...editingSinger, repertoire: nr });
    };

    const updateRepertoireKey = (sid: string, k: string) => {
        if (!editingSinger.repertoire) return;
        setEditingSinger({...editingSinger, repertoire: {...editingSinger.repertoire, [sid]: k}});
    };

    const processRawItems = (rawItems: {title: string, artist: string, key: string}[]) => {
         const newPending: PendingImportItem[] = [];
         
         rawItems.forEach(item => {
             const existing = songs.find(s => s.title.toLowerCase() === item.title.toLowerCase());
             const hasSpecificKey = item.key && item.key !== 'OG' && item.key.trim() !== '';
             const key = hasSpecificKey ? item.key : '';
             
             if (existing) {
                 newPending.push({
                     tempId: uuidv4(),
                     title: existing.title,
                     artist: existing.artist,
                     singerKey: key || 'OG',
                     originalKey: existing.originalKey,
                     isNew: false,
                     existingId: existing.id,
                     isKeyProvided: hasSpecificKey
                 });
             } else {
                 newPending.push({
                     tempId: uuidv4(),
                     title: item.title,
                     artist: item.artist,
                     singerKey: key || 'OG',
                     originalKey: key || 'C',
                     isNew: true,
                     isKeyProvided: hasSpecificKey
                 });
             }
         });
         
         setPendingImports(newPending);
    };

    const handleImportRepertoire = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (!text) return;
            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
            const rawItems: {title: string, artist: string, key: string}[] = [];
            
            let startIndex = 0;
            const firstLineLower = lines[0].toLowerCase();
            if (firstLineLower.includes('song') && (firstLineLower.includes('artist') || firstLineLower.includes('key'))) { startIndex = 1; }
            
            for (let i = startIndex; i < lines.length; i++) {
                const parts = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.trim().replace(/^"|"$/g, ''));
                if (parts.length < 1) continue;
                if (!parts[0]) continue;
                
                rawItems.push({
                    title: parts[0],
                    artist: parts[1] || 'Unknown',
                    key: parts[2] || 'OG'
                });
            }
            processRawItems(rawItems);
        };
        reader.readAsText(file);
        e.target.value = ''; 
    };

    const handleImportRepertoireWithGemini = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsProcessingAI(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            if (!text) { setIsProcessingAI(false); return; }
            
            const parsedData = await parseRepertoireText(text);
            setIsProcessingAI(false);
            
            if (!parsedData) { alert("Failed to parse text with Gemini."); return; }
            
            const rawItems = parsedData.map(item => ({
                title: item.title,
                artist: item.artist || 'Unknown',
                key: item.key || 'OG'
            }));
            
            processRawItems(rawItems);
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    // Standardize pending items using MusicBrainz
    const handleStandardize = async (setProgress: (msg: string) => void) => {
        const items = [...pendingImports];
        const total = items.length;
        
        for (let i = 0; i < total; i++) {
            const item = items[i];
            // Skip existing known songs or items with no title
            if (!item.isNew || !item.title) continue;

            setProgress(`Searching MusicBrainz: ${item.title} (${i + 1}/${total})...`);
            
            // Note: musicbrainz-api library handles rate limiting internally
            const metadata = await searchMusicBrainz(item.title, item.artist);
            
            if (metadata) {
                items[i] = {
                    ...item,
                    title: metadata.title,
                    artist: metadata.artist,
                    // Only update key if MB returned one (rare) and we don't have a specific singer key
                    originalKey: metadata.key || item.originalKey
                };
            }
        }
        
        setPendingImports(items);
        setProgress('');
    };

    const handleUpdatePendingItem = (tempId: string, field: 'singerKey' | 'originalKey', value: string) => {
        setPendingImports(prev => prev.map(item => 
            item.tempId === tempId ? { ...item, [field]: value } : item
        ));
    };

    const handleConfirmImport = () => {
        const newSongs: Song[] = [];
        const updatedRepertoire = { ...(editingSinger.repertoire || {}) };

        pendingImports.forEach(item => {
            let songId = item.existingId;

            if (item.isNew) {
                const newSong: Song = {
                    id: uuidv4(),
                    title: item.title,
                    artist: item.artist,
                    originalKey: item.originalKey || 'C',
                    gigData: createGigData()
                };
                newSongs.push(newSong);
                songId = newSong.id;
            }

            if (songId) {
                updatedRepertoire[songId] = item.singerKey || 'OG';
            }
        });

        if (newSongs.length > 0) {
            setSongs(prev => [...prev, ...newSongs]);
        }
        setEditingSinger({ ...editingSinger, repertoire: updatedRepertoire });
        setPendingImports([]);
    };

    if (pendingImports.length > 0) {
        return (
            <ImportReview 
                items={pendingImports}
                onUpdateItem={handleUpdatePendingItem}
                onConfirm={handleConfirmImport}
                onCancel={() => setPendingImports([])}
                onStandardize={handleStandardize}
            />
        );
    }

    return (
        <div className={MODAL.OVERLAY}>
          <div className={`${MODAL.CONTAINER} ${MODAL.SIZE.LG} ${MODAL.SIZE.MAX_HEIGHT}`}>
            <div className={MODAL.HEADER}>
              <h2 className={MODAL.TITLE}>{editingSinger.id ? 'Edit Singer' : 'Add Singer'}</h2>
              <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className={MODAL.BODY}>
              <div className={MODAL.GRID_COL_2}>
                <div>
                  <COMMON.LABEL>Name</COMMON.LABEL>
                  <COMMON.INPUT.BASE type="text" value={editingSinger.name || ''} onChange={e => setEditingSinger({ ...editingSinger, name: e.target.value })} autoFocus />
                </div>
                <div>
                  <COMMON.LABEL>Vocal Range</COMMON.LABEL>
                  <COMMON.INPUT.SELECT value={editingSinger.range || Range.UNSPECIFIED} onChange={e => setEditingSinger({ ...editingSinger, range: e.target.value as Range })}>
                    {Object.values(Range).map(r => <option key={r} value={r}>{r}</option>)}
                  </COMMON.INPUT.SELECT>
                </div>
              </div>

              <div>
                <div className={MODAL.IMPORT.WRAPPER}>
                  <COMMON.LABEL>Repertoire ({Object.keys(editingSinger.repertoire || {}).length} songs)</COMMON.LABEL>
                  <div className={MODAL.IMPORT.ACTIONS}>
                    <label className={MODAL.IMPORT.BTN_AI}>
                        <Sparkles size={12} className="mr-1" /> Import w/ AI
                        <input type="file" accept=".txt,.csv" ref={aiFileInputRef} onChange={handleImportRepertoireWithGemini} className="hidden" />
                    </label>
                    <label className={MODAL.IMPORT.BTN_CSV}>
                        <FileDown size={12} className="mr-1" /> Import CSV
                        <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImportRepertoire} className="hidden" />
                    </label>
                  </div>
                </div>
                {isProcessingAI && (
                    <div className={MODAL.IMPORT.LOADER}>
                        <Loader2 size={12} className="animate-spin mr-2"/> AI is reading your file...
                    </div>
                )}
                <COMMON.INPUT.SEARCH_WRAPPER className="mb-2">
                   <COMMON.INPUT.SEARCH_ICON><Search size={16} /></COMMON.INPUT.SEARCH_ICON>
                   <COMMON.INPUT.SEARCH_FIELD type="text" placeholder="Search to add/remove songs..." value={repertoireSearch} onChange={e => setRepertoireSearch(e.target.value)} />
                </COMMON.INPUT.SEARCH_WRAPPER>
                <div className={MODAL.LIST.CONTAINER}>
                  {songs
                    .filter(s => s.title.toLowerCase().includes(repertoireSearch.toLowerCase()) || s.artist.toLowerCase().includes(repertoireSearch.toLowerCase()))
                    .map(song => {
                      const isKnown = editingSinger.repertoire && editingSinger.repertoire[song.id];
                      return (
                        <div key={song.id} className={MODAL.SONG_ITEM(!!isKnown)}>
                          <div className={MODAL.LIST.ITEM_CONTENT} onClick={() => toggleSongInRepertoire(song)}>
                             <div className={MODAL.CHECK_BOX(!!isKnown)}>
                               {isKnown && <Check size={12} className="text-white" />}
                             </div>
                             <div className="truncate">
                               <div className={MODAL.LIST.TEXT_MAIN}>{song.title}</div>
                               <div className={MODAL.LIST.TEXT_SUB}>{song.artist}</div>
                             </div>
                          </div>
                          {isKnown && (
                             <div className={MODAL.LIST.KEY_EDIT}>
                               {editingSinger.repertoire![song.id] === 'OG' && (
                                   <span className={MODAL.LIST.KEY_BADGE} title={`Original Key: ${song.originalKey}`}>({song.originalKey})</span>
                               )}
                               <input 
                                 type="text" 
                                 value={editingSinger.repertoire![song.id]} 
                                 onChange={(e) => updateRepertoireKey(song.id, e.target.value)}
                                 className={MODAL.LIST.KEY_INPUT}
                                 placeholder="Key"
                                 onClick={(e) => e.stopPropagation()}
                               />
                             </div>
                          )}
                        </div>
                      );
                  })}
                </div>
              </div>
            </div>
            <div className={MODAL.FOOTER}>
              <button onClick={onClose} className={COMMON.BUTTON.GHOST}>Cancel</button>
              <button onClick={onSave} className={COMMON.BUTTON.PRIMARY}>Save Singer</button>
            </div>
          </div>
        </div>
    );
};
