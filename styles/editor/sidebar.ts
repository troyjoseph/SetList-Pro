export const EDITOR_SIDEBAR = {
  CONTAINER: "w-80 bg-white border-r flex flex-col z-10 shadow-sm",
  HEADER: "p-4 border-b bg-gray-50",
  TITLE: "text-sm font-bold uppercase text-gray-500 mb-3",
  LIST: "flex-1 overflow-y-auto p-2 space-y-1",
  SONG_CARD: "bg-white border rounded p-2 text-sm hover:shadow-sm cursor-move group hover:border-indigo-300 transition-colors",
  SEARCH_INPUT: "w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900",
  SELECT: "w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900",
  QUICK_ADD_CONTAINER: "p-2 mb-2 bg-indigo-50 rounded-md border border-indigo-100",
  QUICK_ADD_WRAPPER: "relative",
  QUICK_ADD_INPUT: "w-full pl-2 pr-8 py-1.5 text-sm border border-gray-300 rounded bg-white text-gray-900",
  QUICK_ADD_BTN: "absolute right-1 top-1 text-indigo-600 hover:text-indigo-800 p-0.5",
  LOADER_ICON: "animate-spin",
  
  // Card internals
  CARD_HEADER: "flex justify-between items-start",
  CARD_TITLE: "font-medium text-gray-900 line-clamp-1",
  CARD_RATING: "flex",
  CARD_ARTIST: "text-xs text-gray-500 mb-1",
  CARD_TAGS: "flex flex-wrap gap-1 mt-1",
  CARD_TAG: (isPreferred: boolean) => `px-1.5 py-0.5 rounded text-[10px] border ${isPreferred ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`
};