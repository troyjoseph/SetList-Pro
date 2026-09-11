
import React, { useState, useRef } from 'react';
import { X, Sparkles, FileDown, Loader2, Search, Check } from 'lucide-react';
import { Singer, Song, Range } from '../../types';
import { parseRepertoireText, parseRepertoireFile } from '../../services/geminiService';
import { searchMusicBrainz, CanonicalMetadata } from '../../services/musicBrainzService';
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
  appDefaults?: any;
}

export const SingerModal: React.FC<SingerModalProps> = ({ isOpen, onClose, editingSinger, setEditingSinger, onSave, songs, setSongs, appDefaults }) => {
    const [repertoireSearch, setRepertoireSearch] = useState('');
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [pendingImports, setPendingImports] = useState<PendingImportItem[]>([]);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const toggleSongInRepertoire = (song: Song) => {
        if (!editingSinger.repertoire) return;
        const nr = { ...editingSinger.repertoire };
        if (nr[song.id]) {
            delete nr[song.id];
        } else {
            nr[song.id] = { key: 'OG' }; 
        }
        setEditingSinger({ ...editingSinger, repertoire: nr });
    };

    const updateRepertoireKey = (sid: string, k: string) => {
        if (!editingSinger.repertoire) return;
        const current = editingSinger.repertoire[sid] || { key: 'OG' };
        setEditingSinger({
            ...editingSinger, 
            repertoire: {
                ...editingSinger.repertoire, 
                [sid]: { ...current, key: k }
            }
        });
    };

    const updateRepertoireNote = (sid: string, n: string) => {
        if (!editingSinger.repertoire) return;
        const current = editingSinger.repertoire[sid] || { key: 'OG' };
        setEditingSinger({
            ...editingSinger, 
            repertoire: {
                ...editingSinger.repertoire, 
                [sid]: { ...current, note: n }
            }
        });
    };

    const processRawItems = (rawItems: {title: string, artist: string, singer_key: string, song_key: string | null, note?: string}[]) => {
         const newPending: PendingImportItem[] = [];
         
         rawItems.forEach(item => {
             const existing = findBestSongMatch(songs, item.title, item.artist);

             const singerKey = item.singer_key || 'OG';
             const songKey = item.song_key;
             
             if (existing) {
                 newPending.push({
                     tempId: uuidv4(),
                     title: item.title, 
                     artist: item.artist, 
                     singerKey: singerKey,
                     originalKey: songKey || existing.originalKey, 
                     isNew: false,
                     existingId: existing.id,
                     isKeyProvided: singerKey !== 'OG' || !!songKey,
                     matchedTitle: existing.title,
                     matchedArtist: existing.artist,
                     matchedKey: existing.originalKey,
                     note: item.note
                 });
             } else {
                 newPending.push({
                     tempId: uuidv4(),
                     title: item.title,
                     artist: item.artist,
                     singerKey: singerKey,
                     originalKey: songKey || '',
                     isNew: true,
                     isKeyProvided: singerKey !== 'OG' || !!songKey,
                     note: item.note
                 });
             }
         });
         
         setPendingImports(newPending);
    };

    const handleUnifiedImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsProcessingAI(true);
        
        const isPdf = file.type === 'application/pdf';
        const isCsv = file.name.toLowerCase().endsWith('.csv');
        const reader = new FileReader();

        reader.onload = async (event) => {
            let parsedData;
            
            if (isPdf) {
                const dataUrl = event.target?.result as string;
                const base64 = dataUrl.split(',')[1];
                parsedData = await parseRepertoireFile(base64, 'application/pdf');
            } else {
                const text = event.target?.result as string;
                if (!text) { setIsProcessingAI(false); return; }
                
                const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                const firstLineLower = (lines[0] || '').toLowerCase();
                const isStandardCsv = isCsv && (
                    (firstLineLower.includes('song') || firstLineLower.includes('title')) && 
                    (firstLineLower.includes('artist') || firstLineLower.includes('key'))
                );

                if (isStandardCsv) {
                    console.log("[Import] Standard CSV detected, skipping AI.");
                    let startIndex = 1;
                    const rawItems: any[] = [];
                    for (let i = startIndex; i < lines.length; i++) {
                        const parts = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.trim().replace(/^"|"$/g, ''));
                        if (parts.length < 1 || !parts[0]) continue;
                        rawItems.push({
                            title: parts[0],
                            artist: parts[1] || 'Unknown',
                            singer_key: parts[2] || 'OG',
                            song_key: null
                        });
                    }
                    parsedData = rawItems;
                } else {
                    console.log("[Import] Using Gemini AI for parsing.");
                    parsedData = await parseRepertoireText(text);
                }
            }
            
            setIsProcessingAI(false);
            
            if (!parsedData) { alert("Failed to parse file."); return; }
            
            const rawItemsSelection = parsedData.map((item: any) => ({
                title: item.title,
                artist: item.artist || 'Unknown',
                singer_key: item.singer_key,
                song_key: item.song_key,
                note: item.note
            }));
            
            processRawItems(rawItemsSelection);
        };

        if (isPdf) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
        e.target.value = '';
    };

    // Standardize pending items using MusicBrainz and Gemini
    const handleStandardize = async (setProgress: (msg: string) => void) => {
        console.log(`[Standardize] Starting standardization for ${pendingImports.length} items`);
        const items = [...pendingImports];
        const newItems = items.filter(item => item.isNew && item.title);
        const total = newItems.length;
        let processedCount = 0;
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            // Skip existing known songs or items with no title
            if (!item.isNew || !item.title) continue;

            processedCount++;
            setProgress(`Searching MusicBrainz: ${item.title} (${processedCount}/${total})...`);
            
            // Note: musicbrainz-api library handles rate limiting internally
            const matches = await searchMusicBrainz(item.title, item.artist);
            
            if (matches && matches.length > 0) {
                console.log(`[Standardize] Found ${matches.length} matches for "${item.title}"`);
                
                // Sort by score descending
                const sortedMatches = [...matches].sort((a, b) => b.score - a.score);
                
                const finalMatchesMap = new Map<string, CanonicalMetadata>();
                sortedMatches.forEach(m => {
                    const key = `${m.title.toLowerCase()}|${m.artist.toLowerCase()}|${m.key || ''}`;
                    if (!finalMatchesMap.has(key) || m.score > finalMatchesMap.get(key)!.score) {
                        finalMatchesMap.set(key, m);
                    }
                });
                const finalMatches = Array.from(finalMatchesMap.values()).sort((a, b) => b.score - a.score);

                const bestMatch = finalMatches[0];

                // Tighten auto-match:
                // 1. If it's a near perfect match (>= 90)
                // 2. If it's the ONLY match and it's reasonably strong (>= 75)
                // Otherwise, let the user select from potential matches.
                if (bestMatch.score >= 90 || (finalMatches.length === 1 && bestMatch.score >= 75)) {
                    // Check if this newly canonicalized Metadata matches something ALREADY in our bank
                    const existingInBank = findBestSongMatch(songs, bestMatch.title, bestMatch.artist);
                    
                    if (existingInBank) {
                        items[i] = {
                            ...item,
                            title: bestMatch.title,
                            artist: bestMatch.artist,
                            singerKey: item.singerKey,
                            isNew: false,
                            existingId: existingInBank.id,
                            matchedTitle: existingInBank.title,
                            matchedArtist: existingInBank.artist,
                            matchedKey: existingInBank.originalKey,
                            potentialMatches: undefined
                        };
                    } else {
                        items[i] = {
                            ...item,
                            title: bestMatch.title,
                            artist: bestMatch.artist,
                            originalKey: bestMatch.key || item.originalKey,
                            duration: bestMatch.duration,
                            potentialMatches: finalMatches.length > 1 ? finalMatches : undefined
                        };
                    }
                } else {
                    // Multiple matches with lower scores, store them for user selection
                    items[i] = {
                        ...item,
                        potentialMatches: finalMatches
                    };
                }
            } else {
                console.log(`[Standardize] No match found for "${item.title}"`);
            }
        }
        
        console.log(`[Standardize] Standardization complete`);
        setPendingImports(items);
        setProgress('');
    };

    const handleUpdatePendingItem = (tempId: string, field: 'singerKey' | 'originalKey' | 'title' | 'artist' | 'note', value: string) => {
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

    const handleSelectMatch = (tempId: string, match: any) => {
        setPendingImports(prev => prev.map(item => 
            item.tempId === tempId ? {
                ...item,
                title: match.title,
                artist: match.artist,
                originalKey: match.key || item.originalKey,
                duration: match.duration,
                potentialMatches: undefined
            } : item
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
                    originalKey: item.originalKey || '',
                    duration: item.duration,
                    gigData: createGigData()
                };
                newSongs.push(newSong);
                songId = newSong.id;
            }

            if (songId) {
                updatedRepertoire[songId] = {
                    key: item.singerKey || 'OG',
                    note: item.note
                };
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
                onSelectMatch={handleSelectMatch}
                onConfirm={handleConfirmImport}
                onCancel={() => setPendingImports([])}
                onStandardize={handleStandardize}
                autoStandardize={appDefaults?.autoStandardizeSongs}
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
                    fileInputRef={fileInputRef}
                    isProcessingAI={isProcessingAI}
                    handleUnifiedImport={handleUnifiedImport}
                />
                <RepertoireListPanel 
                    songs={songs}
                    editingSinger={editingSinger}
                    repertoireSearch={repertoireSearch}
                    setRepertoireSearch={setRepertoireSearch}
                    toggleSongInRepertoire={toggleSongInRepertoire}
                    updateRepertoireKey={updateRepertoireKey}
                    updateRepertoireNote={updateRepertoireNote}
                />
              </div>
            </div>
            <div className={MODAL.FOOTER}>
              <COMMON.BUTTON.GHOST onClick={onClose}>Cancel</COMMON.BUTTON.GHOST>
              <COMMON.BUTTON.PRIMARY onClick={onSave}>Save Singer</COMMON.BUTTON.PRIMARY>
            </div>
          </div>
        </div>
    );
};
