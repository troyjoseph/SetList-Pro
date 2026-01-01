
import { EventDetails, EventSet, SetListSlot, Song, Singer, GigType } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Calculates the structure of sets (empty slots) based on event settings.
 * Preserves existing slots if resizing.
 */
export const calculateSetStructure = (event: EventDetails): EventSet[] => {
  const sets: EventSet[] = [];
  const avgSongLength = event.settings.avgSongMin || 4; 

  const oldSets = event.sets || [];

  for (let i = 0; i < event.numberOfSets; i++) {
    let slotCount = 0;

    if (event.setLengthType === 'SONG_COUNT') {
      slotCount = event.songsPerSet || 10;
    } else {
      // Time based
      const minutes = event.minutesPerSet || 45;
      slotCount = Math.ceil(minutes / avgSongLength) + (event.settings.bufferSongs || 0);
    }

    const slots: SetListSlot[] = [];
    const existingSet = oldSets[i];

    for (let j = 0; j < slotCount; j++) {
      if (existingSet && existingSet.slots[j]) {
        slots.push(existingSet.slots[j]);
      } else {
        slots.push({
          id: uuidv4(),
          songId: '',
          singerId: '',
          key: '',
          isRequest: false
        });
      }
    }

    sets.push({
      id: existingSet ? existingSet.id : uuidv4(),
      name: existingSet ? existingSet.name : `Set ${i + 1}`,
      slots
    });
  }

  return sets;
};

/**
 * Core Algorithm:
 * 1. Calculate capacity.
 * 2. Assign Must-Plays (Pre-Sets first, then General).
 * 3. Fill gaps with "Best Fit" (Prioritizing Soft Requests)
 */
export const generateSetList = (
  event: EventDetails,
  allSongs: Song[],
  allSingers: Singer[]
): EventSet[] => {
  
  // Deep copy sets to avoid mutation
  const newSets: EventSet[] = JSON.parse(JSON.stringify(event.sets));
  const gigType = event.gigType;
  const maxSlowSongs = event.settings.maxSlowSongsPerSet;
  const totalSets = newSets.length;
  
  // Filter available singers
  const activeSingers = allSingers.filter(s => event.selectedSingerIds.includes(s.id));
  
  // --- Quota Calculation ---
  const totalSlots = newSets.reduce((acc, set) => acc + set.slots.length, 0);
  const explicitQuotas = event.singerQuotas || {};
  
  // Calculate how many slots are reserved by explicit quotas
  let reservedSlots = 0;
  let singersWithExplicitQuota = 0;
  
  activeSingers.forEach(s => {
      if (explicitQuotas[s.id] !== undefined && explicitQuotas[s.id] > 0) {
          reservedSlots += explicitQuotas[s.id];
          singersWithExplicitQuota++;
      }
  });

  // Calculate default quota for remaining singers (Equal Distribution)
  const singersWithoutQuota = activeSingers.length - singersWithExplicitQuota;
  const remainingSlots = Math.max(0, totalSlots - reservedSlots);
  const defaultQuota = singersWithoutQuota > 0 
      ? Math.ceil(remainingSlots / singersWithoutQuota) 
      : 999; // Fallback

  const getSingerMaxSongs = (id: string) => {
      if (explicitQuotas[id] !== undefined && explicitQuotas[id] > 0) {
          return explicitQuotas[id];
      }
      return defaultQuota;
  };

  // Track usage to prevent duplicates
  const usedSongIds = new Set<string>();
  const singerHistory: string[] = []; 
  const singerCounts: Record<string, number> = {};

  // 1. Scan existing slots to preserve them (Autofill only fills empty)
  newSets.forEach(set => {
    set.slots.forEach(slot => {
      if (slot.songId) {
        usedSongIds.add(slot.songId);
        
        if (slot.singerId) {
            singerCounts[slot.singerId] = (singerCounts[slot.singerId] || 0) + 1;
            singerHistory.push(slot.singerId);
        }
      } else {
        // Ensure empty slots are clean
        slot.singerId = '';
        slot.key = '';
        slot.isRequest = false;
        slot.requestType = undefined;
        slot.momentName = undefined;
        slot.note = undefined;
      }
    });
  });

  // --- Pre-Process Requests ---
  
  // 1. Identify Forbidden Songs (Direct IDs or via Artist)
  const forbiddenSongIds = new Set<string>();
  event.doNotPlay.forEach(item => {
    if (item.type === 'SONG') {
      forbiddenSongIds.add(item.value);
    } else if (item.type === 'ARTIST') {
      // For simplicity, case-insensitive check on artist name
      allSongs.forEach(s => {
        if (s.artist.toLowerCase() === item.value.toLowerCase()) {
          forbiddenSongIds.add(s.id);
        }
      });
    }
  });

  // 2. Identify Must Play IDs (Expand Artists to all their allowed songs)
  const mustPlaySongIds = new Set<string>();
  const mustPlayConfig: Record<string, { assignedSingerId?: string, note?: string }> = {};

  event.mustPlay.forEach(item => {
    if (item.type === 'SONG') {
      if (!forbiddenSongIds.has(item.value)) {
        mustPlaySongIds.add(item.value);
        mustPlayConfig[item.value] = { 
             assignedSingerId: item.assignedSingerId,
             note: item.placementGuideline 
        };
      }
    } else if (item.type === 'ARTIST') {
      allSongs.forEach(s => {
        if (s.artist.toLowerCase() === item.value.toLowerCase() && !forbiddenSongIds.has(s.id)) {
          mustPlaySongIds.add(s.id);
          // Only set if not already set by a specific song request
          if (!mustPlayConfig[s.id]) {
             mustPlayConfig[s.id] = {
                 assignedSingerId: item.assignedSingerId,
                 note: item.placementGuideline
             };
          }
        }
      });
    }
  });

  // 3. Identify Soft Request IDs (Expand Artists)
  const softRequestConfig: Record<string, { assignedSingerId?: string, note?: string }> = {};
  
  (event.softRequests || []).forEach(item => {
      if (item.type === 'SONG') {
        if (!forbiddenSongIds.has(item.value) && !mustPlaySongIds.has(item.value)) {
           softRequestConfig[item.value] = {
              assignedSingerId: item.assignedSingerId,
              note: item.placementGuideline
           };
        }
      } else if (item.type === 'ARTIST') {
         allSongs.forEach(s => {
            if (s.artist.toLowerCase() === item.value.toLowerCase() && !forbiddenSongIds.has(s.id) && !mustPlaySongIds.has(s.id)) {
               if (!softRequestConfig[s.id]) {
                   softRequestConfig[s.id] = {
                       assignedSingerId: item.assignedSingerId,
                       note: item.placementGuideline
                   };
               }
            }
         });
      }
  });

  // --- 2. Place Requests ---

  // A. Mark Special Moments as used (Do not place in sets)
  event.specialMoments.forEach(req => {
    if (req.songId) {
      usedSongIds.add(req.songId);
    }
  });

  // B. Place General Must-Play Requests
  // Iterate over our expanded list of must-play IDs
  Array.from(mustPlaySongIds).forEach(songId => {
    if (usedSongIds.has(songId)) return;
    const song = allSongs.find(s => s.id === songId);
    if (!song) return;
    
    const config = mustPlayConfig[songId];

    // Determine Singer
    let singerId = '';
    let key = song.originalKey;
    
    // 1. Try manually assigned singer
    if (config?.assignedSingerId) {
        const assigned = activeSingers.find(s => s.id === config.assignedSingerId);
        if (assigned) {
             singerId = assigned.id;
             const repKey = assigned.repertoire[songId];
             if (repKey) {
                 key = repKey === 'OG' ? song.originalKey : repKey;
             }
        }
    }

    // 2. If no manual assignment or singer invalid, auto-assign
    if (!singerId) {
        const candidate = activeSingers.find(s => {
            const knowsSong = !!s.repertoire[songId];
            const underQuota = (singerCounts[s.id] || 0) < getSingerMaxSongs(s.id);
            return knowsSong && underQuota;
        });

        if (candidate) {
            singerId = candidate.id;
            const repKey = candidate.repertoire[songId];
            key = repKey === 'OG' ? song.originalKey : repKey;
        }
    }

    if (!singerId) {
       // If no one knows it or everyone is over quota, we skip
       return; 
    }

    // Place anywhere
    for (const set of newSets) {
      const emptySlot = set.slots.find(s => !s.songId);
      if (emptySlot) {
        emptySlot.songId = song.id;
        emptySlot.singerId = singerId;
        emptySlot.key = key;
        emptySlot.isRequest = true;
        emptySlot.requestType = 'IN_SET';
        emptySlot.note = config?.note;
        usedSongIds.add(song.id);
        singerCounts[singerId] = (singerCounts[singerId] || 0) + 1;
        break;
      }
    }
  });


  // --- 3. Fill Gaps (Including Soft Requests) ---

  // Helper to get score
  const getSongScore = (song: Song, singer: Singer, setIndex: number, prevSlot: SetListSlot | null, slowSongsInSetCount: number): number => {
    const data = song.gigData[gigType];
    if (!data) return -9999;

    let score = 0;

    // 0. Hard Constraints
    // Slow Songs limit
    if (data.isSlow && slowSongsInSetCount >= maxSlowSongs) {
      return -10000;
    }
    
    // 1. Star Rating (Primary Driver)
    const rating = data.rating || 0;
    if (rating === 0) return -1000; // Skip unrated/no-star songs
    score += rating * 50;

    // 2. Singer Rotation
    if (singerHistory.length > 0 && singerHistory[singerHistory.length - 1] === singer.id) {
      score -= 50; // Penalty for same singer twice in a row
    }

    // 3. Variety (Slow Songs)
    if (data.isSlow) {
       score -= 10; // Slight penalty to space them out unless preferred
    }

    // 4. Key Matching
    const repKey = singer.repertoire[song.id];
    const singerKey = repKey === 'OG' ? song.originalKey : repKey;
    if (singerKey === song.originalKey) score += 5;

    // 5. Preferred/Avoided Sets
    const isFirstSet = setIndex === 0;
    const isFirstTwo = setIndex <= 1;
    const isLastSet = setIndex === totalSets - 1;
    const isLastTwo = setIndex >= totalSets - 2;

    // Avoid Logic (Heavy Penalty)
    if (
      (data.setsToAvoid === 'FIRST' && isFirstSet) ||
      (data.setsToAvoid === 'FIRST_TWO' && isFirstTwo) ||
      (data.setsToAvoid === 'LAST' && isLastSet) ||
      (data.setsToAvoid === 'LAST_TWO' && isLastTwo)
    ) {
      score -= 5000;
    }

    // Preference Logic (Bonus)
    if (
      (data.preferredSets === 'FIRST' && isFirstSet) ||
      (data.preferredSets === 'FIRST_TWO' && isFirstTwo) ||
      (data.preferredSets === 'LAST' && isLastSet) ||
      (data.preferredSets === 'LAST_TWO' && isLastTwo)
    ) {
      score += 30;
    }

    // 6. Transitions
    if (prevSlot && prevSlot.songId) {
      // Bonus if this song matches transition FROM previous
      if (data.goodTransitionFrom.includes(prevSlot.songId)) {
        score += 40;
      }
      // Bonus if previous song points TO this song
      const prevSong = allSongs.find(s => s.id === prevSlot.songId);
      if (prevSong && prevSong.gigData[gigType]?.goodTransitionTo.includes(song.id)) {
        score += 40;
      }
    }

    // 7. Preferred Singers
    if (data.preferredSingers.includes(singer.id)) {
      score += 20;
    }

    // 8. Soft Request Logic (High Bonus)
    const softConfig = softRequestConfig[song.id];
    if (softConfig) {
        score += 200; // Major Boost
        
        // Singer preference
        if (softConfig.assignedSingerId) {
             if (softConfig.assignedSingerId === singer.id) score += 50;
             else score -= 50; 
        }

        // Simple placement parsing (Text matching)
        if (softConfig.note) {
             const note = softConfig.note.toLowerCase();
             // Check keywords
             if ((note.includes('1') || note.includes('first') || note.includes('start')) && isFirstSet) score += 50;
             if ((note.includes('last') || note.includes('end') || note.includes('close')) && isLastSet) score += 50;
             if ((note.includes('2') || note.includes('second')) && setIndex === 1) score += 50;
             if ((note.includes('3') || note.includes('third')) && setIndex === 2) score += 50;
        }
    }

    return score;
  };

  // Iterate through every empty slot
  newSets.forEach((set, setIndex) => {
    set.slots.forEach((slot, slotIndex) => {
      // Skip already filled slots
      if (slot.songId) return;

      // Calculate current slow songs count for this set dynamically
      let currentSlowCount = 0;
      set.slots.forEach(s => {
        if (s.songId) {
          const found = allSongs.find(song => song.id === s.songId);
          if (found?.gigData[gigType]?.isSlow) currentSlowCount++;
        }
      });

      // Find candidates
      let candidates: { song: Song; singer: Singer; score: number; note?: string }[] = [];

      allSongs.forEach(song => {
        if (usedSongIds.has(song.id)) return;
        if (forbiddenSongIds.has(song.id)) return; // Check global forbidden set

        // Who can sing this?
        const capableSingers = activeSingers.filter(s => {
            const knowsSong = !!s.repertoire[song.id];
            const maxSongs = getSingerMaxSongs(s.id);
            const currentCount = singerCounts[s.id] || 0;
            return knowsSong && currentCount < maxSongs;
        });

        capableSingers.forEach(singer => {
            const prevSlot = slotIndex > 0 ? set.slots[slotIndex - 1] : null;
            const score = getSongScore(song, singer, setIndex, prevSlot, currentSlowCount);
            candidates.push({ song, singer, score });
        });
      });

      // Sort by score
      candidates.sort((a, b) => b.score - a.score);

      if (candidates.length > 0 && candidates[0].score > -500) {
        const best = candidates[0];
        slot.songId = best.song.id;
        slot.singerId = best.singer.id;
        
        const repKey = best.singer.repertoire[best.song.id];
        slot.key = repKey === 'OG' ? best.song.originalKey : repKey;
        
        // Attach soft request note if applicable
        const softConfig = softRequestConfig[best.song.id];
        if (softConfig?.note) {
            slot.note = softConfig.note;
        }
        
        usedSongIds.add(best.song.id);
        singerHistory.push(best.singer.id);
        singerCounts[best.singer.id] = (singerCounts[best.singer.id] || 0) + 1;
      }
    });
  });

  return newSets;
};
