
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
import { BasicInfoPanel } from './singer/BasicInfoPanel';
import { ImportActionsPanel } from './singer/ImportActionsPanel';
import { RepertoireListPanel } from './singer/RepertoireListPanel';

import { findBestSongMatch } from '../../utils/songMatching';

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
             const existing = findBestSongMatch(songs, item.title, item.artist);

             const hasSpecificKey = item.key && item.key !== 'OG' && item.key.trim() !== '';
             const key = hasSpecificKey ? item.key : '';
             
             if (existing) {
                 newPending.push({
                     tempId: uuidv4(),
                     title: item.title, // Keep original parsed title
                     artist: item.artist, // Keep original parsed artist
                     singerKey: key || 'OG',
                     originalKey: existing.originalKey,
                     isNew: false,
                     existingId: existing.id,
                     isKeyProvided: hasSpecificKey,
                     matchedTitle: existing.title,
                     matchedArtist: existing.artist,
                     matchedKey: existing.originalKey
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

    const handleRejectMatch = (tempId: string) => {
        setPendingImports(prev => prev.map(item => 
            item.tempId === tempId 
                ? { ...item, isNew: true, existingId: undefined, matchedTitle: undefined, matchedArtist: undefined, matchedKey: undefined } 
                : item
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
                onRejectMatch={handleRejectMatch}
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
              <BasicInfoPanel editingSinger={editingSinger} setEditingSinger={setEditingSinger} />

              <div>
                <ImportActionsPanel 
                    editingSinger={editingSinger}
                    aiFileInputRef={aiFileInputRef}
                    fileInputRef={fileInputRef}
                    isProcessingAI={isProcessingAI}
                    handleImportRepertoireWithGemini={handleImportRepertoireWithGemini}
                    handleImportRepertoire={handleImportRepertoire}
                />
                <RepertoireListPanel 
                    songs={songs}
                    editingSinger={editingSinger}
                    repertoireSearch={repertoireSearch}
                    setRepertoireSearch={setRepertoireSearch}
                    toggleSongInRepertoire={toggleSongInRepertoire}
                    updateRepertoireKey={updateRepertoireKey}
                />
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
