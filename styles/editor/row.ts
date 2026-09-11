
export const EDITOR_ROW = {
  BASE: "flex items-center justify-between p-2 rounded border bg-white hover:bg-gray-50 transition-colors group",
  BASE_EMPTY: "flex items-center justify-between p-2 rounded border border-dashed border-gray-300 bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors h-12",
  HANDLE: "w-8 flex justify-center text-gray-400 cursor-grab active:cursor-grabbing shrink-0",
  ICON_BOX: "bg-purple-100 text-purple-700 p-1.5 rounded", 
  HANDLE_ICON: "mx-auto",
  INDEX_TEXT: "text-sm font-mono",
  CONTENT: "flex-1 min-w-0 px-2 sm:px-3",
  TITLE_ROW: "flex items-center flex-wrap gap-1",
  TITLE: "font-medium text-gray-900 truncate",
  SUBTITLE: "text-xs text-gray-500 truncate",
  CONTROLS: "flex items-center space-x-1 sm:space-x-3 shrink-0",
  SINGER_COL: "flex items-center gap-1 sm:gap-2",
  SELECT: "text-xs border-none bg-transparent font-medium text-indigo-600 focus:ring-0 cursor-pointer hover:bg-indigo-50 rounded px-1 w-24 sm:w-32 max-w-[128px] truncate",
  KEY_BADGE: (isChange: boolean) => `text-xs font-mono px-1.5 py-0.5 rounded border flex justify-center w-7 ${isChange ? 'bg-yellow-200 text-yellow-900 font-bold border-yellow-300' : 'bg-white text-gray-500 border-gray-200'}`,
  BADGE_REQ: "text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide",
  BADGE_LOCK: "text-gray-400",
  TRANSITION: "text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200 mt-1 inline-block",
  REMOVE_BTN: "text-gray-300 hover:text-red-500 p-1 md:opacity-0 group-hover:opacity-100 transition-opacity",
  EMPTY_TEXT: "text-sm text-gray-400 italic px-3 flex-1",
  RATING_WRAPPER: "flex items-center",
  STAR_ICON: "fill-yellow-400 text-yellow-400"
};
