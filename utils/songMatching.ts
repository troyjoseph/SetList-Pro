import { Song } from '../types';

export const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

export const levenshtein = (a: string, b: string) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

export const isFuzzyMatch = (str1: string, str2: string) => {
    const n1 = normalize(str1);
    const n2 = normalize(str2);
    if (!n1 || !n2) return false;
    if (n1 === n2) return true;
    if (n1.length > 5 && n2.length > 5 && (n1.includes(n2) || n2.includes(n1))) return true;
    
    const dist = levenshtein(n1, n2);
    const maxLen = Math.max(n1.length, n2.length);
    return dist <= Math.max(2, maxLen * 0.2);
};

export const findBestSongMatch = (songs: Song[], itemTitle: string, itemArtist: string): Song | undefined => {
    // Try to find an exact match on normalized title and artist first
    let existing = songs.find(s => 
        normalize(s.title) === normalize(itemTitle) && 
        normalize(s.artist) === normalize(itemArtist)
    );
    
    // Fallback to fuzzy matching title AND artist
    if (!existing) {
        existing = songs.find(s => 
            isFuzzyMatch(s.title, itemTitle) && 
            isFuzzyMatch(s.artist, itemArtist)
        );
    }
    
    // Fallback to just matching the normalized title
    if (!existing) {
        existing = songs.find(s => normalize(s.title) === normalize(itemTitle));
    }
    
    // Fallback to fuzzy matching just the title
    if (!existing) {
        existing = songs.find(s => isFuzzyMatch(s.title, itemTitle));
    }

    return existing;
};
