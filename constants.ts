import { GigType, Range, Singer, Song, GigSpecificData } from './types';

const defaultGigData: GigSpecificData = {
  rating: 0,
  isSlow: false,
  isDuet: false,
  preferredSets: 'ANY',
  setsToAvoid: 'ANY',
  goodTransitionFrom: [],
  goodTransitionTo: [],
  preferredSingers: [],
  preferredPlacement: ''
};

export const createGigData = (overrides: Partial<GigSpecificData> = {}): Record<string, GigSpecificData> => {
  const data: Record<string, GigSpecificData> = {};
  Object.values(GigType).forEach(type => {
    data[type] = { ...defaultGigData, ...overrides };
  });
  return data;
};

// Helper to set specific ratings
const withRatings = (base: Record<string, GigSpecificData>, ratings: Record<string, number>) => {
  Object.entries(ratings).forEach(([type, rating]) => {
    if (base[type]) base[type].rating = rating;
  });
  return base;
};

export const INITIAL_SONGS: Song[] = [
  { 
    id: '1', title: 'September', artist: 'Earth, Wind & Fire', originalKey: 'D',
    gigData: withRatings(createGigData({ isSlow: false }), { [GigType.WEDDING]: 3, [GigType.CORPORATE]: 3 })
  },
  { 
    id: '2', title: 'At Last', artist: 'Etta James', originalKey: 'F',
    gigData: withRatings(createGigData({ isSlow: true }), { [GigType.WEDDING]: 3, [GigType.CORPORATE]: 2 })
  },
  { 
    id: '3', title: 'Don\'t Stop Believin\'', artist: 'Journey', originalKey: 'E',
    gigData: withRatings(createGigData({ isSlow: false, preferredSets: 'LAST' }), { [GigType.WEDDING]: 3, [GigType.CLUB]: 3 })
  },
  { 
    id: '4', title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper', originalKey: 'G',
    gigData: withRatings(createGigData({ isSlow: true, isDuet: true }), { [GigType.WEDDING]: 2 })
  },
  { 
    id: '5', title: 'Uptown Funk', artist: 'Mark Ronson', originalKey: 'Dm',
    gigData: withRatings(createGigData({ isSlow: false }), { [GigType.WEDDING]: 3, [GigType.CORPORATE]: 3 })
  },
  { 
    id: '6', title: 'Sweet Caroline', artist: 'Neil Diamond', originalKey: 'B',
    gigData: withRatings(createGigData({ isSlow: false }), { [GigType.WEDDING]: 3, [GigType.CORPORATE]: 3 })
  },
  { 
    id: '7', title: 'Tennessee Whiskey', artist: 'Chris Stapleton', originalKey: 'A',
    gigData: withRatings(createGigData({ isSlow: true }), { [GigType.WEDDING]: 2, [GigType.CLUB]: 3 })
  },
  { 
    id: '8', title: 'I Wanna Dance With Somebody', artist: 'Whitney Houston', originalKey: 'Gb',
    gigData: withRatings(createGigData({ isSlow: false }), { [GigType.WEDDING]: 3 })
  },
  { 
    id: '9', title: 'Valerie', artist: 'Amy Winehouse', originalKey: 'Eb',
    gigData: withRatings(createGigData({ isSlow: false }), { [GigType.WEDDING]: 2, [GigType.CORPORATE]: 3 })
  },
  { 
    id: '10', title: 'Mr. Brightside', artist: 'The Killers', originalKey: 'Db',
    gigData: withRatings(createGigData({ isSlow: false, preferredSets: 'LAST_TWO' }), { [GigType.CLUB]: 3, [GigType.WEDDING]: 3 })
  },
  { 
    id: '11', title: 'Perfect', artist: 'Ed Sheeran', originalKey: 'Ab',
    gigData: withRatings(createGigData({ isSlow: true }), { [GigType.WEDDING]: 3 })
  },
  { 
    id: '12', title: 'Respect', artist: 'Aretha Franklin', originalKey: 'C',
    gigData: withRatings(createGigData({ isSlow: false }), { [GigType.CORPORATE]: 3 })
  },
];

export const INITIAL_SINGERS: Singer[] = [
  { 
    id: 's1', 
    name: 'Alice (Alto)', 
    range: Range.ALTO_HIGH, 
    repertoire: { '1': 'D', '2': 'F', '5': 'Dm', '8': 'Gb', '9': 'Eb', '11': 'Ab', '12': 'C' } 
  },
  { 
    id: 's2', 
    name: 'Bob (Tenor)', 
    range: Range.TENOR_LOW, 
    repertoire: { '1': 'D', '3': 'E', '4': 'G', '5': 'Cm', '6': 'B', '7': 'A', '10': 'Db' } 
  },
  { 
    id: 's3', 
    name: 'Charlie (Baritone)', 
    range: Range.TENOR_LOW, 
    repertoire: { '3': 'E', '5': 'Dm', '6': 'B', '7': 'G', '10': 'C' } 
  },
];
