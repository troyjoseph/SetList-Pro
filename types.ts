
export enum GigType {
  WEDDING = 'Wedding',
  CORPORATE = 'Corporate',
  CLUB = 'Club',
  PRIVATE = 'Private'
}

export enum Range {
  TENOR_LOW = 'Tenor/Low',
  ALTO_HIGH = 'Alto/High',
  UNSPECIFIED = 'Unspecified'
}

export type SetPreference = 'FIRST' | 'FIRST_TWO' | 'LAST' | 'LAST_TWO' | 'ANY';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface GigSpecificData {
  rating: number; // 0-3
  isSlow: boolean;
  isDuet: boolean;
  preferredSets: SetPreference;
  setsToAvoid: SetPreference;
  goodTransitionFrom: string[]; // List of Song IDs
  goodTransitionTo: string[]; // List of Song IDs
  preferredSingers: string[]; // List of Singer IDs
  preferredPlacement: string; // Free text guideline
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  originalKey: string;
  // Configuration per gig type
  gigData: Record<string, GigSpecificData>; 
}

export interface Singer {
  id: string;
  name: string;
  range: Range;
  // Map of SongID -> Key they sing it in
  repertoire: Record<string, string>; 
}

export interface SetListSlot {
  id: string; // unique instance id
  songId: string;
  singerId: string; // The assigned singer
  key: string; // The actual key being played
  isRequest: boolean;
  requestType?: 'PRE_SET' | 'IN_SET';
  momentName?: string;
  note?: string;
  locked?: boolean; // If true, auto-fill won't move it
}

export interface EventSet {
  id: string;
  name: string;
  slots: SetListSlot[];
}

export type SetLengthType = 'SONG_COUNT' | 'TIME';

// Complex requests (Moments)
export interface SpecialMoment {
  id: string;
  songId: string;
  momentName?: string; // e.g., "First Dance"
  assignedSingerId?: string; // If empty, auto-assign
}

export interface RequestItem {
  type: 'SONG' | 'ARTIST';
  value: string; // Song ID or Artist Name
  label: string; // Display string
  placementGuideline?: string; 
  assignedSingerId?: string;
}

export interface EventDetails {
  id: string;
  name: string;
  date: string;
  gigType: GigType;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  selectedSingerIds: string[];
  singerQuotas?: Record<string, number>; // Map SingerID -> Max Songs. Undefined = Auto/Equal
  sets: EventSet[];
  
  // Set Configuration
  numberOfSets: number;
  setLengthType: SetLengthType;
  minutesPerSet?: number;
  songsPerSet?: number;

  specialMoments: SpecialMoment[]; // Pre-set moments with specific needs
  mustPlay: RequestItem[]; // General requests (Songs or Artists)
  softRequests: RequestItem[]; // Good to have, but not mandatory
  doNotPlay: RequestItem[]; // Forbidden (Songs or Artists)
  
  settings: {
    avgSongMin: number;
    bufferSongs: number;
    showTimestampsCount: number;
    maxSlowSongsPerSet: number;
    moments: string[]; // List of available moment names
  };
}

export type ViewState = 'DASHBOARD' | 'SONGBANK' | 'SINGERS' | 'EVENT_SETUP' | 'EDITOR' | 'PRINT' | 'SETTINGS';

export interface DragPayload {
  songId?: string;
  singerId?: string;
  key?: string;
  setIndex?: number;
  slotIndex?: number;
}