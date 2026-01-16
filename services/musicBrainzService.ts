
import { MusicBrainzApi } from "musicbrainz-api";

// Initialize the API client
// Note: In a browser environment, the library might log warnings about unsafe headers (User-Agent).
// This is expected and usually handled by the browser ignoring the header.
let mbApi: MusicBrainzApi;
try {
    mbApi = new MusicBrainzApi({
      appName: 'SetListPro',
      appVersion: '1.0.0',
      appMail: 'contact@example.com' 
    });
} catch (e) {
    console.error("Failed to initialize MusicBrainzApi", e);
}

// Types based on MusicBrainz API response
interface MusicBrainzRecording {
  id: string;
  score: number;
  title: string;
  'artist-credit'?: Array<{ name: string; artist: { id: string; name: string } }>;
  tags?: Array<{ count: number; name: string }>;
}

export interface CanonicalMetadata {
  title: string;
  artist: string;
  key?: string;
}

export const searchMusicBrainz = async (queryTitle: string, queryArtist: string): Promise<CanonicalMetadata | null> => {
  if (!mbApi) return null;

  try {
    // Clean inputs for Lucene query construction
    const safeTitle = queryTitle.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, " ").trim();
    const safeArtist = queryArtist.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, " ").trim();
    
    if (!safeTitle) return null;

    // Construct Lucene query string
    const query = `recording:"${safeTitle}"${safeArtist ? ` AND artist:"${safeArtist}"` : ''}`;
    
    // Perform search using the library
    // The library handles rate limiting automatically
    const result = await mbApi.search('recording', { query, limit: 1 });

    if (result.recordings && result.recordings.length > 0) {
      const match = result.recordings[0] as MusicBrainzRecording;
      
      // Strict score threshold to avoid bad matches
      if (match.score < 80) return null;

      // Extract metadata
      const meta: CanonicalMetadata = {
        title: match.title,
        artist: match['artist-credit']?.[0]?.name || queryArtist
      };

      // Try to infer key from tags
      if (match.tags) {
        const keyTag = match.tags.find(t => t.name.match(/^[a-g][#b]?\s?(major|minor)?$/i));
        if (keyTag) {
            // Normalize key string
            let key = keyTag.name.replace(/\s?major/i, '').replace(/\s?minor/i, 'm');
            key = key.charAt(0).toUpperCase() + key.slice(1);
            meta.key = key;
        }
      }

      return meta;
    }

    return null;

  } catch (error) {
    console.warn("MusicBrainz Search Failed:", error);
    return null;
  }
};
