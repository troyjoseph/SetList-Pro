
import { MusicBrainzApi } from "musicbrainz-api";

// Initialize the API client
// Note: In a browser environment, the library might log warnings about unsafe headers (User-Agent).
// This is expected and usually handled by the browser ignoring the header.
let mbApi: MusicBrainzApi;
try {
    mbApi = new MusicBrainzApi({
      appName: 'SetListPro',
      appVersion: '1.0.0',
      appContactInfo: 'contact@example.com' 
    });
} catch (e) {
    console.error("Failed to initialize MusicBrainzApi", e);
}

// Types based on MusicBrainz API response
interface MusicBrainzRecording {
  id: string;
  score: number;
  title: string;
  disambiguation?: string;
  length?: number;
  'artist-credit'?: Array<{ name: string; artist: { id: string; name: string } }>;
  tags?: Array<{ count: number; name: string }>;
}

export interface CanonicalMetadata {
  title: string;
  artist: string;
  key?: string;
  duration?: number; // in milliseconds
  score: number;
  disambiguation?: string;
}

export const searchMusicBrainz = async (queryTitle: string, queryArtist: string): Promise<CanonicalMetadata[]> => {
  if (!mbApi) return [];

  try {
    // Clean inputs for Lucene query construction
    const safeTitle = queryTitle.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, " ").trim();
    const safeArtist = queryArtist.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, " ").trim();
    
    if (!safeTitle) return [];

    const isArtistUnspecified = !safeArtist || 
                               safeArtist.toLowerCase() === 'unknown' || 
                               safeArtist.toLowerCase() === 'none' ||
                               safeArtist.trim() === '';

    // Construct Lucene query string
    // If artist is specified, we MANDATE it in the search query to avoid cross-artist matches
    let query = "";
    if (!isArtistUnspecified) {
        // Prioritize exact phrase matches with boosting
        query = `(recording:"${safeTitle}"^3 OR recording:(${safeTitle})) AND (artist:"${safeArtist}"^3 OR artist:(${safeArtist}))`;
    } else {
        // Only search for song name if the artist is unspecified
        query = `recording:"${safeTitle}"^3 OR recording:(${safeTitle})`;
    }
    
    console.log(`[MusicBrainz] Searching with query: ${query}`);
    
    // Perform search using the library
    // The library handles rate limiting automatically
    const result = await mbApi.search('recording', { query, limit: 20 }); // Increased limit to find more potential matches for deduplication
    console.log(`[MusicBrainz] Raw API result:`, result);

    if (result.recordings && result.recordings.length > 0) {
      const matches: CanonicalMetadata[] = result.recordings.map(match => {
        const m = match as MusicBrainzRecording;
        
        const meta: CanonicalMetadata = {
          title: m.title,
          artist: m['artist-credit']?.[0]?.name || queryArtist,
          score: m.score,
          disambiguation: m.disambiguation,
          duration: m.length // length is in ms
        };

        // Try to infer key from tags
        if (m.tags) {
          const keyTag = m.tags.find(t => {
            const n = t.name.toLowerCase();
            return n.match(/^[a-g][#b♯♭]?\s?(major|minor|m)?$/i) || 
                   n.includes('key:') ||
                   n.match(/^[a-g][#b♯♭]?\s?(maj|min)$/i);
          });
          
          if (keyTag) {
              let keyName = keyTag.name.toLowerCase();
              if (keyName.includes('key:')) {
                keyName = keyName.split('key:')[1].trim();
              }
              // Normalize key string
              let key = keyName.replace(/\s?major/i, '').replace(/\s?maj/i, '').replace(/\s?minor/i, 'm').replace(/\s?min/i, 'm');
              key = key.charAt(0).toUpperCase() + key.slice(1);
              // Ensure it's a valid key format before assigning
              if (key.match(/^[A-G][#b♯♭]?m?$/)) {
                meta.key = key;
              }
          }
        }

        // Fallback to disambiguation if no key tag found
        if (!meta.key && m.disambiguation) {
           const keyMatch = m.disambiguation.match(/\b([A-G][#b♯♭]?\s?(major|minor|m|maj|min)?)\b/i);
           if (keyMatch) {
              let key = keyMatch[1].toLowerCase()
                .replace(/\s?major/i, '')
                .replace(/\s?maj/i, '')
                .replace(/\s?minor/i, 'm')
                .replace(/\s?min/i, 'm');
              key = key.charAt(0).toUpperCase() + key.slice(1);
              if (key.match(/^[A-G][#b♯♭]?m?$/)) {
                meta.key = key;
              }
           }
        }

        return meta;
      });

      // Filter by score threshold
      const filtered = matches.filter(m => m.score >= 55); // Lowered slightly to catch more fuzzy matches

      // Deduplicate: If title, artist, and key are the same, keep only the one with the highest score
      // We also normalize the title to remove common suffixes like "(live)", "(remastered)"
      const normalizeTitle = (t: string) => {
          return t.toLowerCase()
            .replace(/\(live.*\)/g, '')
            .replace(/\[live.*\]/g, '')
            .replace(/\(remaster.*\)/g, '')
            .replace(/\[remaster.*\]/g, '')
            .replace(/\(edit.*\)/g, '')
            .replace(/\[edit.*\]/g, '')
            .replace(/\(version.*\)/g, '')
            .replace(/\[version.*\]/g, '')
            .trim();
      };

      const deduplicated = new Map<string, CanonicalMetadata>();
      filtered.forEach(m => {
        const normTitle = normalizeTitle(m.title);
        const key = `${normTitle}|${m.artist.toLowerCase()}|${m.key || ''}`;
        const existing = deduplicated.get(key);
        
        // If we have a duplicate, we prefer the one with a key, then the one with the higher score
        if (!existing) {
          deduplicated.set(key, m);
        } else {
          const existingHasKey = !!existing.key;
          const currentHasKey = !!m.key;
          
          if (currentHasKey && !existingHasKey) {
            deduplicated.set(key, m);
          } else if (currentHasKey === existingHasKey) {
            if (m.score > existing.score) {
              deduplicated.set(key, m);
            }
          }
        }
      });

      return Array.from(deduplicated.values()).sort((a, b) => b.score - a.score);
    }

    return [];

  } catch (error) {
    console.warn("MusicBrainz Search Failed:", error);
    return [];
  }
};
