
import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GigType, Range, Song, Singer, EventDetails, ViewState, SpecialMoment } from '../types';
import { INITIAL_SONGS, INITIAL_SINGERS, createGigData } from '../constants';
import { enrichSongData } from '../services/geminiService';
import { generateSetList, calculateSetStructure } from '../services/autoBuilder';

export const useAppLogic = () => {
  // --- Navigation State ---
  const [view, setView] = useState<ViewState>(() => {
    const saved = localStorage.getItem('setlist_view_state');
    return (saved as ViewState) || 'DASHBOARD';
  });

  // --- Data State ---
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('setlist_songs');
    return saved ? JSON.parse(saved) : INITIAL_SONGS;
  });

  const [singers, setSingers] = useState<Singer[]>(() => {
    const saved = localStorage.getItem('setlist_singers');
    return saved ? JSON.parse(saved) : INITIAL_SINGERS;
  });

  const [events, setEvents] = useState<EventDetails[]>(() => {
    const saved = localStorage.getItem('setlist_events_v2'); 
    const parsed = saved ? JSON.parse(saved) : [];
    // Migration: ensure softRequests exists on old records
    return parsed.map((e: any) => ({
        ...e,
        softRequests: e.softRequests || []
    }));
  });

  const [appDefaults, setAppDefaults] = useState(() => {
    const saved = localStorage.getItem('setlist_app_defaults');
    if (saved) return JSON.parse(saved);
    return {
      avgSongMin: 4,
      bufferSongs: 1,
      maxSlowSongsPerSet: 1,
      showTimestampsCount: 6,
      keyHighlightColor: 'yellow',
      moments: ["Father/Daughter Dance", "Mother/Son Dance", "First Dance", "Cake Cutting", "Bouquet Toss", "Entrance", "Speech Intro"]
    };
  });

  const [activeEventId, setActiveEventId] = useState<string | null>(() => {
    return localStorage.getItem('setlist_active_event_id') || null;
  });

  // --- UI/Modal State ---
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [isSingerModalOpen, setIsSingerModalOpen] = useState(false);
  const [editingSinger, setEditingSinger] = useState<Partial<Singer>>({});
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Partial<Song>>({});
  const [activeGigTypeTab, setActiveGigTypeTab] = useState<GigType>(GigType.WEDDING);
  const [isMomentModalOpen, setIsMomentModalOpen] = useState(false);
  const [newMomentRequest, setNewMomentRequest] = useState<Partial<SpecialMoment>>({});

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // --- Persistence Effects ---
  useEffect(() => localStorage.setItem('setlist_songs', JSON.stringify(songs)), [songs]);
  useEffect(() => localStorage.setItem('setlist_singers', JSON.stringify(singers)), [singers]);
  useEffect(() => localStorage.setItem('setlist_events_v2', JSON.stringify(events)), [events]);
  useEffect(() => localStorage.setItem('setlist_app_defaults', JSON.stringify(appDefaults)), [appDefaults]);
  useEffect(() => localStorage.setItem('setlist_view_state', view), [view]);
  useEffect(() => {
    if (activeEventId) {
        localStorage.setItem('setlist_active_event_id', activeEventId);
    } else {
        localStorage.removeItem('setlist_active_event_id');
    }
  }, [activeEventId]);

  // --- Validation Effects ---
  useEffect(() => {
      const eventViews: ViewState[] = ['EDITOR', 'EVENT_SETUP', 'PRINT'];
      if (eventViews.includes(view)) {
          if (!activeEventId) {
              setView('DASHBOARD');
          } else {
              const exists = events.some(e => e.id === activeEventId);
              if (!exists) {
                  setActiveEventId(null);
                  setView('DASHBOARD');
              }
          }
      }
  }, [view, activeEventId, events]);

  // --- Derived State ---
  const currentEvent = useMemo(() => events.find(e => e.id === activeEventId) || null, [events, activeEventId]);
  
  const activeSingers = useMemo(() => {
    if (!currentEvent) return [];
    return singers.filter(s => currentEvent.selectedSingerIds.includes(s.id));
  }, [currentEvent, singers]);

  // --- Helpers ---
  const setCurrentEvent = (updated: EventDetails) => {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const requestConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // --- Actions ---

  const handleAddSong = async (title: string) => {
    if (!title.trim()) {
        const blankSong: Song = { id: uuidv4(), title: '', artist: '', originalKey: '', gigData: createGigData() };
        setEditingSong({...blankSong}); 
        setActiveGigTypeTab(GigType.WEDDING); 
        setIsSongModalOpen(true);
        return;
    }
    setIsAddingSong(true);
    const enriched = await enrichSongData(title);
    if (enriched) {
      const newSong = { id: uuidv4(), ...enriched } as Song;
      setSongs(prev => [newSong, ...prev]);
    } else {
        const newSong: Song = { id: uuidv4(), title: title, artist: 'Unknown', originalKey: 'C', gigData: createGigData() };
        setSongs(prev => [newSong, ...prev]);
    }
    setIsAddingSong(false);
  };

  const createNewEvent = () => {
    const newEvent: EventDetails = {
      id: uuidv4(), name: 'New Event', date: new Date().toISOString().split('T')[0], gigType: GigType.WEDDING, startTime: '', endTime: '',
      numberOfSets: 3, setLengthType: 'TIME', minutesPerSet: 45, selectedSingerIds: singers.map(s => s.id), sets: [],
      specialMoments: [], mustPlay: [], softRequests: [], doNotPlay: [], singerQuotas: {},
      settings: { ...appDefaults }
    };
    setEvents(prev => [...prev, newEvent]);
    setActiveEventId(newEvent.id);
    setView('EVENT_SETUP');
  };

  const duplicateEvent = (eventId: string) => {
    const eventToDuplicate = events.find(e => e.id === eventId);
    if (!eventToDuplicate) return;

    const newEvent: EventDetails = {
        ...JSON.parse(JSON.stringify(eventToDuplicate)),
        id: uuidv4(),
        name: `${eventToDuplicate.name} (Copy)`
    };

    setEvents(prev => [newEvent, ...prev]);
  };

  const deleteEvent = (eventId: string) => {
    requestConfirm('Delete Event', 'Are you sure you want to delete this event permanently?', () => {
      setEvents(prev => prev.filter(e => e.id !== eventId));
      if (activeEventId === eventId) {
        setActiveEventId(null);
        setView('DASHBOARD');
      }
    });
  };

  const handleDeleteCurrentEvent = () => {
    if (!currentEvent) return;
    deleteEvent(currentEvent.id);
  };

  const handleDeleteSinger = (id: string) => {
    requestConfirm('Delete Singer', 'Are you sure you want to delete this singer? This cannot be undone.', () => {
        setSingers(prev => prev.filter(s => s.id !== id));
    });
  };

  const handleDeleteSong = (id: string) => {
    requestConfirm('Delete Song', 'Are you sure you want to delete this song permanently?', () => {
        setSongs(prev => prev.filter(s => s.id !== id));
    });
  };

  const handleSaveEventSetup = () => {
    if (!currentEvent) return;
    const builtSets = calculateSetStructure(currentEvent);
    setCurrentEvent({ ...currentEvent, sets: builtSets });
    setView('EDITOR');
  };

  const handleAutoFill = () => {
    if (!currentEvent) return;
    const filledSets = generateSetList(currentEvent, songs, singers);
    setCurrentEvent({ ...currentEvent, sets: filledSets });
    setView('EDITOR');
  };

  const handleExportCSV = () => {
    if (!currentEvent) return;
    let csvContent = "data:text/csv;charset=utf-8,Set,Position,Song Title,Artist,Singer,Key,Type,Moment\n";
    currentEvent.sets.forEach((set) => {
      set.slots.forEach((slot, index) => {
        if (!slot.songId) return;
        const song = songs.find(s => s.id === slot.songId);
        const singer = singers.find(s => s.id === slot.singerId);
        csvContent += `${set.name},${index + 1},"${song?.title || ''}","${song?.artist || ''}",${singer?.name || ''},${slot.key},${slot.requestType || 'Standard'},${slot.momentName || ''}\n`;
      });
    });
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${currentEvent.name.replace(/\s+/g, '_')}_setlist.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveSinger = () => {
    if (!editingSinger.name) return;
    setSingers(prev => {
      const idx = prev.findIndex(s => s.id === editingSinger.id);
      if (idx > -1) return prev.map((s, i) => i === idx ? editingSinger as Singer : s);
      return [...prev, editingSinger as Singer];
    });
    setIsSingerModalOpen(false);
  };

  const handleSaveSong = () => {
    if (!editingSong.id) {
        const newSong = { ...editingSong } as Song;
        if (!newSong.id) newSong.id = uuidv4();
        if (!newSong.gigData) newSong.gigData = createGigData();
        setSongs(prev => [newSong, ...prev]);
    } else {
        setSongs(prev => prev.map(s => s.id === editingSong.id ? editingSong as Song : s));
    }
    setIsSongModalOpen(false);
  };

  const handleAddMoment = () => {
    if (!newMomentRequest.songId || !currentEvent) return;
    const moment: SpecialMoment = { id: uuidv4(), songId: newMomentRequest.songId!, momentName: newMomentRequest.momentName, assignedSingerId: newMomentRequest.assignedSingerId };
    setCurrentEvent({ ...currentEvent, specialMoments: [...currentEvent.specialMoments, moment] });
    setIsMomentModalOpen(false);
  };

  return {
    // State
    view, setView,
    songs, setSongs,
    singers, setSingers,
    events, setEvents,
    appDefaults, setAppDefaults,
    activeEventId, setActiveEventId,
    currentEvent, setCurrentEvent,
    activeSingers,
    
    // UI State
    isAddingSong,
    isSingerModalOpen, setIsSingerModalOpen,
    editingSinger, setEditingSinger,
    isSongModalOpen, setIsSongModalOpen,
    editingSong, setEditingSong,
    activeGigTypeTab, setActiveGigTypeTab,
    isMomentModalOpen, setIsMomentModalOpen,
    newMomentRequest, setNewMomentRequest,
    confirmConfig, setConfirmConfig,

    // Actions
    requestConfirm,
    handleAddSong,
    createNewEvent,
    duplicateEvent,
    deleteEvent,
    handleDeleteCurrentEvent,
    handleDeleteSinger,
    handleDeleteSong,
    handleSaveEventSetup,
    handleAutoFill,
    handleExportCSV,
    handleSaveSinger,
    handleSaveSong,
    handleAddMoment
  };
};
