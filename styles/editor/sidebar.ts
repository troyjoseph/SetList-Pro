export const EDITOR_SIDEBAR = {
  CONTAINER: "w-80 h-full bg-white border-r flex flex-col z-10 shadow-sm",
  HEADER: "p-4 border-b bg-gray-50",
  TITLE: "text-sm font-bold uppercase text-gray-500 mb-3",
  LIST: "flex-1 overflow-y-auto p-2 space-y-1",
  SONG_CARD: "bg-white border rounded p-2 text-sm hover:shadow-sm cursor-move group hover:border-indigo-300 transition-colors",
  SONG_CARD_IN_SET: "bg-gray-50 border border-dashed border-gray-200 rounded p-2 text-sm cursor-move group hover:border-indigo-300 transition-colors opacity-70",
  SEARCH_INPUT: "w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900",
  SELECT: "w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900",
  QUICK_ADD_CONTAINER: "p-2 mb-2 bg-indigo-50 rounded-md border border-indigo-100",
  QUICK_ADD_WRAPPER: "relative",
  QUICK_ADD_INPUT: "w-full pl-2 pr-8 py-1.5 text-sm border border-gray-300 rounded bg-white text-gray-900",
  QUICK_ADD_BTN: "absolute right-1 top-1 text-indigo-600 hover:text-indigo-800 p-0.5",
  LOADER_ICON: "animate-spin",
  
  // In-set controls and indicators
  SHOW_USED_TOGGLE: "flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none mt-2 pt-1 border-t border-gray-200/60",
  CHECKBOX: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 text-xs",
  IN_SET_BADGE: "px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200 shrink-0",
  EMPTY_STATE: "p-4 text-center text-xs text-gray-400 italic",
  
  // Card internals
  CARD_HEADER: "flex justify-between items-start",
  CARD_TITLE: "font-medium text-gray-900 line-clamp-1",
  CARD_TITLE_BTN: "font-medium text-gray-900 line-clamp-1 text-left hover:text-indigo-600 hover:underline decoration-dotted underline-offset-2 transition-colors",
  CARD_RATING: "flex",
  CARD_ARTIST: "text-xs text-gray-500 mb-1",
  CARD_ARTIST_BTN: "text-xs text-gray-500 mb-1 text-left hover:text-indigo-500 hover:underline decoration-dotted underline-offset-2 transition-colors block",
  CARD_TAGS: "flex flex-wrap gap-1 mt-1",
  CARD_TAG: (isPreferred: boolean) => `px-1.5 py-0.5 rounded text-[10px] border ${isPreferred ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`
};