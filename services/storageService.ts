
import { Song, Singer, EventDetails } from "../types";
import { INITIAL_SONGS, INITIAL_SINGERS } from "../constants";

export const storageService = {
  loadUserData: async (userId: string) => {
    return {
      songs: JSON.parse(localStorage.getItem('setlist_songs') || 'null') || INITIAL_SONGS,
      singers: JSON.parse(localStorage.getItem('setlist_singers') || 'null') || INITIAL_SINGERS,
      events: JSON.parse(localStorage.getItem('setlist_events') || 'null') || [],
      settings: JSON.parse(localStorage.getItem('setlist_settings') || 'null')
    };
  },

  saveSongs: async (userId: string, songs: Song[]) => {
    localStorage.setItem('setlist_songs', JSON.stringify(songs));
  },

  saveSingers: async (userId: string, singers: Singer[]) => {
    localStorage.setItem('setlist_singers', JSON.stringify(singers));
  },

  saveEvents: async (userId: string, events: EventDetails[]) => {
    localStorage.setItem('setlist_events', JSON.stringify(events));
  },

  saveSettings: async (userId: string, settings: any) => {
    localStorage.setItem('setlist_settings', JSON.stringify(settings));
  }
};
