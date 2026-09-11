
import React, { useState, useRef } from 'react';
import { X, Upload, Loader2, User, FileText, Check, ChevronRight, Sparkles } from 'lucide-react';
import { Singer, Song, Range } from '../../types';
import { parseRepertoireText, parseRepertoireFile } from '../../services/geminiService';
import { searchMusicBrainz, CanonicalMetadata } from '../../services/musicBrainzService';
import { findBestSongMatch } from '../../utils/songMatching';
import { v4 as uuidv4 } from 'uuid';
import { createGigData } from '../../constants';
import { COMMON } from '../../styles/common';
import { MODAL } from '../../styles/modals';
import { ImportReview, PendingImportItem } from './ImportReview';

interface BulkImportSinger {
    id: string;
    name: string;
    file: File;
    pendingItems: PendingImportItem[];
    status: 'QUEUED' | 'PARSING' | 'STANDARDIZING' | 'READY' | 'REVIEWED' | 'ERROR';
    statusDetail?: string;
    error?: string;
}

interface BulkSingerImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  onImportComplete: (newSingers: Singer[]) => void;
  appDefaults?: any;
}

export const BulkSingerImportModal: React.FC<BulkSingerImportModalProps> = ({ isOpen, onClose, songs, setSongs, onImportComplete, appDefaults }) => {
    const [importStage, setImportStage] = useState<'SELECT' | 'PROCESSING' | 'REVIEW'>('SELECT');
    const [singersToImport, setSingersToImport] = useState<BulkImportSinger[]>([]);
    const [currentSingerIndex, setCurrentSingerIndex] = useState(0);
    const [processingProgress, setProcessingProgress] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        const newSingers: BulkImportSinger[] = selectedFiles.map(file => ({
            id: uuidv4(),
            name: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
            file,
            pendingItems: [],
            status: 'QUEUED'
        }));

        setSingersToImport(prev => [...prev, ...newSingers]);
        e.target.value = '';
    };

    const removeSinger = (id: string) => {
        setSingersToImport(prev => prev.filter(s => s.id !== id));
    };

    const updateSingerName = (id: string, name: string) => {
        setSingersToImport(prev => prev.map(s => s.id === id ? { ...s, name } : s));
    };

    const startImport = async () => {
        if (singersToImport.length === 0) return;
        setImportStage('PROCESSING');

        const updatedSingers = [...singersToImport];

        for (let i = 0; i < updatedSingers.length; i++) {
            const singer = updatedSingers[i];
            
            // 1. Parsing with Gemini
            updatedSingers[i] = { ...updatedSingers[i], status: 'PARSING', statusDetail: 'Reading file...' };
            setSingersToImport([...updatedSingers]);
            setProcessingProgress(`Processing ${singer.name}...`);

            try {
                const isPdf = singer.file.type === 'application/pdf';
                const isCsv = singer.file.name.toLowerCase().endsWith('.csv');
                let parsedData;

                updatedSingers[i] = { ...updatedSingers[i], statusDetail: 'Parsing with AI...' };
                setSingersToImport([...updatedSingers]);

                if (isPdf) {
                    const base64 = await fileToBase64(singer.file);
                    parsedData = await parseRepertoireFile(base64, 'application/pdf');
                } else {
                    const text = await singer.file.text();
                    
                    // Unified Logic: Check if it's a well-formatted CSV
                    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                    const firstLineLower = (lines[0] || '').toLowerCase();
                    const isStandardCsv = isCsv && (
                        (firstLineLower.includes('song') || firstLineLower.includes('title')) && 
                        (firstLineLower.includes('artist') || firstLineLower.includes('key'))
                    );

                    if (isStandardCsv) {
                        setProcessingProgress(`Parsing CSV for ${singer.name}...`);
                        updatedSingers[i] = { ...updatedSingers[i], statusDetail: 'Parsing CSV...' };
                        setSingersToImport([...updatedSingers]);

                        let startIndex = 1; // Assume header is always there if isStandardCsv is true
                        const rawItems: any[] = [];
                        for (let j = startIndex; j < lines.length; j++) {
                            const parts = lines[j].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.trim().replace(/^"|"$/g, ''));
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
                        parsedData = await parseRepertoireText(text);
                    }
                }

                if (!parsedData) throw new Error("Gemini parsing failed");

                const songCount = parsedData.length;
                updatedSingers[i] = { ...updatedSingers[i], statusDetail: `Parsed ${songCount} songs` };
                setSingersToImport([...updatedSingers]);

                // Map to PendingImportItem
                const pendingItems: PendingImportItem[] = parsedData.map(item => {
                    const existing = findBestSongMatch(songs, item.title, item.artist);
                    const singerKey = item.singer_key || 'OG';
                    const songKey = item.song_key;

                    if (existing) {
                        return {
                            tempId: uuidv4(),
                            title: item.title,
                            artist: item.artist,
                            singerKey,
                            originalKey: songKey || existing.originalKey,
                            isNew: false,
                            existingId: existing.id,
                            isKeyProvided: singerKey !== 'OG' || !!songKey,
                            matchedTitle: existing.title,
                            matchedArtist: existing.artist,
                            matchedKey: existing.originalKey,
                            note: item.note
                        };
                    } else {
                        return {
                            tempId: uuidv4(),
                            title: item.title,
                            artist: item.artist,
                            singerKey,
                            originalKey: songKey || '',
                            isNew: true,
                            isKeyProvided: singerKey !== 'OG' || !!songKey,
                            note: item.note
                        };
                    }
                });

                updatedSingers[i] = { ...updatedSingers[i], pendingItems, status: 'STANDARDIZING', statusDetail: 'Analyzing Song Bank...' };
                setSingersToImport([...updatedSingers]);

                // 2. Automatically Standardize with MusicBrainz
                const newItemsCount = pendingItems.filter(item => item.isNew).length;
                if (newItemsCount > 0 && appDefaults?.autoStandardizeSongs !== false) {
                    setProcessingProgress(`Standardizing ${singer.name} (${newItemsCount} new)...`);
                    const standardizedItems = await standardizeItems(pendingItems, songs, (msg) => {
                        setProcessingProgress(`${singer.name}: ${msg}`);
                        // Update detail to show count
                        const processedMatch = msg.match(/\((\d+)\/(\d+)\)/);
                        if (processedMatch) {
                            updatedSingers[i] = { ...updatedSingers[i], statusDetail: `Standardizing (${processedMatch[1]}/${processedMatch[2]})` };
                            setSingersToImport([...updatedSingers]);
                        }
                    });
                    updatedSingers[i] = { ...updatedSingers[i], pendingItems: standardizedItems, status: 'READY', statusDetail: `${songCount} songs ready` };
                } else {
                     updatedSingers[i] = { ...updatedSingers[i], status: 'READY', statusDetail: `${songCount} songs ready` };
                }
                
                setSingersToImport([...updatedSingers]);

            } catch (error) {
                console.error(`Error processing ${singer.name}:`, error);
                updatedSingers[i] = { ...updatedSingers[i], status: 'ERROR', error: String(error), statusDetail: 'Failed' };
                setSingersToImport([...updatedSingers]);
            }
        }

        setImportStage('REVIEW');
        setProcessingProgress('');
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]);
            };
            reader.onerror = error => reject(error);
        });
    };

    const standardizeItems = async (items: PendingImportItem[], currentSongs: Song[], setProgress: (msg: string) => void): Promise<PendingImportItem[]> => {
        const resultItems = [...items];
        const newItems = resultItems.filter(item => item.isNew && item.title);
        const total = newItems.length;
        let processedCount = 0;

        for (let i = 0; i < resultItems.length; i++) {
            const item = resultItems[i];
            if (!item.isNew || !item.title) continue;

            processedCount++;
            setProgress(`Searching MusicBrainz: ${item.title} (${processedCount}/${total})...`);

            try {
                const matches = await searchMusicBrainz(item.title, item.artist);
                if (matches && matches.length > 0) {
                    const sortedMatches = [...matches].sort((a, b) => b.score - a.score);
                    // Deduplicate
                    const finalMatchesMap = new Map<string, CanonicalMetadata>();
                    sortedMatches.forEach(m => {
                        const key = `${m.title.toLowerCase()}|${m.artist.toLowerCase()}|${m.key || ''}`;
                        if (!finalMatchesMap.has(key) || m.score > finalMatchesMap.get(key)!.score) {
                            finalMatchesMap.set(key, m);
                        }
                    });
                    const finalMatches = Array.from(finalMatchesMap.values()).sort((a, b) => b.score - a.score);
                    const bestMatch = finalMatches[0];

                    if (bestMatch.score >= 90 || (finalMatches.length === 1 && bestMatch.score >= 75)) {
                        const existingInBank = findBestSongMatch(currentSongs, bestMatch.title, bestMatch.artist);
                        if (existingInBank) {
                            resultItems[i] = {
                                ...item,
                                title: bestMatch.title,
                                artist: bestMatch.artist,
                                isNew: false,
                                existingId: existingInBank.id,
                                matchedTitle: existingInBank.title,
                                matchedArtist: existingInBank.artist,
                                matchedKey: existingInBank.originalKey,
                                potentialMatches: undefined
                            };
                        } else {
                            resultItems[i] = {
                                ...item,
                                title: bestMatch.title,
                                artist: bestMatch.artist,
                                originalKey: bestMatch.key || item.originalKey,
                                duration: bestMatch.duration,
                                potentialMatches: finalMatches.length > 1 ? finalMatches : undefined
                            };
                        }
                    } else {
                        resultItems[i] = { ...item, potentialMatches: finalMatches };
                    }
                }
            } catch (e) {
                console.error("Standardize step failed for one song", e);
            }
        }
        return resultItems;
    };

    const handleUpdatePendingItem = (tempId: string, field: 'singerKey' | 'originalKey' | 'title' | 'artist' | 'note', value: string) => {
        setSingersToImport(prev => prev.map((singer, idx) => {
            if (idx !== currentSingerIndex) return singer;
            return {
                ...singer,
                pendingItems: singer.pendingItems.map(item => 
                    item.tempId === tempId ? { ...item, [field]: value } : item
                )
            };
        }));
    };

    const handleRejectMatch = (tempId: string) => {
        setSingersToImport(prev => prev.map((singer, idx) => {
            if (idx !== currentSingerIndex) return singer;
            return {
                ...singer,
                pendingItems: singer.pendingItems.map(item => 
                    item.tempId === tempId 
                        ? { ...item, isNew: true, existingId: undefined, matchedTitle: undefined, matchedArtist: undefined, matchedKey: undefined } 
                        : item
                )
            };
        }));
    };

    const handleSelectMatch = (tempId: string, match: CanonicalMetadata) => {
        setSingersToImport(prev => prev.map((singer, idx) => {
            if (idx !== currentSingerIndex) return singer;
            return {
                ...singer,
                pendingItems: singer.pendingItems.map(item => 
                    item.tempId === tempId ? {
                        ...item,
                        title: match.title,
                        artist: match.artist,
                        originalKey: match.key || item.originalKey,
                        duration: match.duration,
                        potentialMatches: undefined
                    } : item
                )
            };
        }));
    };

    const handleConfirmSingerReview = () => {
        setSingersToImport(prev => prev.map((s, idx) => idx === currentSingerIndex ? { ...s, status: 'REVIEWED' } : s));
        
        if (currentSingerIndex < singersToImport.length - 1) {
            setCurrentSingerIndex(currentSingerIndex + 1);
        } else {
            // All reviewed, finalize
            finalizeImport();
        }
    };

    const finalizeImport = () => {
        const allNewSongs: Song[] = [];
        const createdSingers: Singer[] = [];
        
        // This is tricky because one singer might add a song that is used by another later in the same batch
        // For simplicity, we'll collect all new songs and ensure they are unique by title/artist
        const finalSongsState = [...songs];

        singersToImport.forEach(singerImport => {
            if (singerImport.status === 'ERROR') return;
            
            const singerRepertoire: Record<string, { key: string; note?: string }> = {};

            singerImport.pendingItems.forEach(item => {
                let songId = item.existingId;

                if (item.isNew) {
                    // Check if already created in this batch
                    const existingInBatch = allNewSongs.find(s => findBestSongMatch([s], item.title, item.artist));
                    if (existingInBatch) {
                        songId = existingInBatch.id;
                    } else {
                        const newSong: Song = {
                            id: uuidv4(),
                            title: item.title,
                            artist: item.artist,
                            originalKey: item.originalKey || '',
                            duration: item.duration,
                            gigData: createGigData()
                        };
                        allNewSongs.push(newSong);
                        finalSongsState.push(newSong);
                        songId = newSong.id;
                    }
                }

                if (songId) {
                    singerRepertoire[songId] = {
                        key: item.singerKey || 'OG',
                        note: item.note
                    };
                }
            });

            createdSingers.push({
                id: uuidv4(),
                name: singerImport.name,
                range: Range.UNSPECIFIED,
                repertoire: singerRepertoire
            });
        });

        if (allNewSongs.length > 0) {
            setSongs(prev => [...prev, ...allNewSongs]);
        }
        
        onImportComplete(createdSingers);
        resetAndClose();
    };

    const resetAndClose = () => {
        setImportStage('SELECT');
        setSingersToImport([]);
        setCurrentSingerIndex(0);
        setProcessingProgress('');
        onClose();
    };

    if (importStage === 'REVIEW') {
        const currentSinger = singersToImport[currentSingerIndex];
        
        // If current singer had an error, skip to next or finish
        if (!currentSinger || currentSinger.status === 'ERROR') {
             if (currentSingerIndex < singersToImport.length - 1) {
                 setCurrentSingerIndex(currentSingerIndex + 1);
                 return null; 
             } else {
                 finalizeImport();
                 return null;
             }
        }

        return (
            <div className={MODAL.OVERLAY}>
                <div className="fixed inset-x-0 top-10 flex justify-center z-[60] pointer-events-none">
                    <div className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-bounce-in">
                        <span className="font-bold">Reviewing Singer {currentSingerIndex + 1} of {singersToImport.length}:</span>
                        <span className="font-medium">{currentSinger.name}</span>
                    </div>
                </div>
                <ImportReview 
                    items={currentSinger.pendingItems}
                    onUpdateItem={handleUpdatePendingItem}
                    onRejectMatch={handleRejectMatch}
                    onSelectMatch={handleSelectMatch}
                    onConfirm={handleConfirmSingerReview}
                    onCancel={resetAndClose}
                    onStandardize={async (setProgress) => {
                        const standardized = await standardizeItems(currentSinger.pendingItems, songs, setProgress);
                        setSingersToImport(prev => prev.map((s, idx) => idx === currentSingerIndex ? { ...s, pendingItems: standardized } : s));
                    }}
                />
            </div>
        );
    }

    return (
        <div className={MODAL.OVERLAY}>
          <div className={`${MODAL.CONTAINER} ${MODAL.SIZE.LG} max-h-[80vh] flex flex-col`}>
            <div className={MODAL.HEADER}>
              <h2 className={MODAL.TITLE}>Bulk Import Singers</h2>
              <button onClick={onClose} disabled={importStage === 'PROCESSING'}>
                <X size={24} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <div className={MODAL.BODY}>
                {importStage === 'SELECT' ? (
                    <div className="space-y-6">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group"
                        >
                            <input 
                                type="file" 
                                multiple 
                                accept=".txt,.pdf,.csv" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                            />
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="text-indigo-600" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Select Files</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                Choose multiple repertoire files (PDF, TXT, CSV).<br/>
                                One singer will be created per file.
                            </p>
                            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium">
                                Browse Files
                            </button>
                        </div>

                        {singersToImport.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                    Queue ({singersToImport.length} Files)
                                </h4>
                                <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
                                    {singersToImport.map(singer => (
                                        <div key={singer.id} className="flex flex-col p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-600">
                                                        <User size={16} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Singer Name</span>
                                                </div>
                                                <button 
                                                    onClick={() => removeSinger(singer.id)}
                                                    className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <input 
                                                    type="text" 
                                                    value={singer.name} 
                                                    onChange={(e) => updateSingerName(singer.id, e.target.value)}
                                                    className="flex-1 text-sm font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                                                    placeholder="Enter singer name..."
                                                />
                                                <div className="flex flex-col items-end min-w-[80px]">
                                                    <div className="flex items-center space-x-1 text-[10px] font-medium text-gray-500">
                                                        {singer.file.type === 'application/pdf' ? <FileText size={10} className="text-red-500"/> : <FileText size={10} className="text-indigo-400"/>}
                                                        <span className="truncate max-w-[100px]">{singer.file.name}</span>
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-mono">{(singer.file.size / 1024).toFixed(1)} KB</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="relative mb-6">
                            <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="text-indigo-600 animate-pulse" size={32} />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Processing Repertoire...</h3>
                        <p className="text-gray-500 mt-2 max-w-sm">
                            We're analyzing your files and automatically standardizing song data.
                        </p>
                        
                        <div className="mt-8 w-full max-w-md space-y-4 text-left">
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
                                <div className="text-xs font-bold text-indigo-400 uppercase mb-1">Status</div>
                                <div className="text-sm text-indigo-700 font-medium flex items-center">
                                    <Loader2 size={14} className="animate-spin mr-2" />
                                    {processingProgress || "Starting..."}
                                </div>
                            </div>

                            <div className="space-y-2">
                                {singersToImport.map((s, idx) => (
                                    <div key={s.id} className="flex items-center justify-between text-xs p-2.5 bg-white border rounded-lg shadow-sm">
                                        <div className="flex items-center">
                                            <span className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full mr-2 font-bold text-gray-500">{idx + 1}</span>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800">{s.name}</span>
                                                {s.statusDetail && <span className="text-[10px] text-gray-400">{s.statusDetail}</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            {s.status === 'QUEUED' && <span className="text-orange-500 font-bold flex items-center"><Loader2 size={12} className="mr-1 animate-spin"/> Queued</span>}
                                            {s.status === 'PARSING' && <span className="text-indigo-500 flex items-center animate-pulse font-bold"><Loader2 size={12} className="mr-1 animate-spin"/> Parsing...</span>}
                                            {s.status === 'STANDARDIZING' && <span className="text-purple-500 flex items-center animate-pulse font-bold"><Sparkles size={12} className="mr-1 animate-pulse"/> Standardizing...</span>}
                                            {s.status === 'READY' && <span className="text-green-500 flex items-center font-bold"><Check size={12} className="mr-1"/> Ready</span>}
                                            {s.status === 'ERROR' && <span className="text-red-500 font-bold">Error</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={MODAL.FOOTER}>
                <COMMON.BUTTON.GHOST 
                    onClick={onClose} 
                    disabled={importStage === 'PROCESSING'}
                >
                    Cancel
                </COMMON.BUTTON.GHOST>
                {importStage === 'SELECT' && (
                    <COMMON.BUTTON.PRIMARY 
                        onClick={startImport}
                        disabled={singersToImport.length === 0}
                    >
                        Import Selected Files
                        <ChevronRight size={18} className="ml-2" />
                    </COMMON.BUTTON.PRIMARY>
                )}
            </div>
          </div>
        </div>
    );
};
