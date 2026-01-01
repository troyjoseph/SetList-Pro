import { COMMON } from './common';

export const MODAL = {
  OVERLAY: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
  CONTAINER: "bg-white rounded-lg shadow-xl w-full flex flex-col",
  SIZE: {
    MD: "max-w-md",
    LG: "max-w-2xl",
    XL: "max-w-4xl",
    MAX_HEIGHT: "max-h-[90vh]"
  },
  HEADER: "p-6 border-b flex justify-between items-center",
  TITLE: "text-xl font-bold",
  BODY: "p-6 overflow-y-auto flex-1 space-y-6",
  BODY_SMALL: "p-4 space-y-4",
  FOOTER: "p-4 border-t bg-gray-50 flex justify-end space-x-2",
  
  SONG_ITEM: (isActive: boolean) => `flex items-center justify-between p-2 hover:bg-gray-50 ${isActive ? 'bg-indigo-50/50' : ''}`,
  CHECK_BOX: (isActive: boolean) => `w-4 h-4 border rounded mr-3 flex items-center justify-center ${isActive ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`,
  
  TAB_BTN: (active: boolean) => `pb-2 text-sm font-medium border-b-2 transition-colors ${active ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`,

  // New
  IMPORT: {
    WRAPPER: "flex justify-between items-center mb-2",
    ACTIONS: "flex items-center space-x-3",
    BTN_AI: "text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center border border-indigo-100 bg-indigo-50 px-2 py-1 rounded",
    BTN_CSV: "text-xs text-gray-600 hover:text-gray-800 cursor-pointer flex items-center border border-gray-200 bg-white px-2 py-1 rounded",
    LOADER: "mb-2 text-xs text-indigo-600 flex items-center bg-indigo-50 p-2 rounded"
  },
  LIST: {
    CONTAINER: "border rounded-md max-h-60 overflow-y-auto divide-y",
    ITEM_CONTENT: "flex items-center flex-1 min-w-0",
    TEXT_MAIN: "text-sm font-medium text-gray-900 truncate",
    TEXT_SUB: "text-xs text-gray-500 truncate",
    KEY_EDIT: "flex items-center",
    KEY_BADGE: "text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded mr-2",
    KEY_INPUT: "w-16 border rounded px-1 py-0.5 text-sm font-mono text-center ml-2 border-gray-300 bg-white text-gray-900",
    ITEM_TITLE: "font-medium",
    ITEM_SUBTITLE: "text-xs text-gray-500"
  },
  REVIEW: {
    TABLE_CONTAINER: "border rounded-lg overflow-hidden",
    TABLE: "min-w-full divide-y divide-gray-200",
    TH: "px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
    TD: "px-4 py-2 whitespace-nowrap text-sm text-gray-700",
    INPUT: "w-20 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border px-2 py-1 text-gray-900 bg-white font-mono",
    BADGE_NEW: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800",
    BADGE_EXISTING: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
  },
  GRID_COL_2: "grid grid-cols-2 gap-4",
  GRID_3: "grid grid-cols-1 md:grid-cols-3 gap-4",
  COL_SPAN_2: "md:col-span-2",
  COL_SPAN_3: "md:col-span-3",
  CONTENT_BOX: "space-y-4 bg-gray-50 p-4 rounded-lg border",
  FLEX_BETWEEN: "flex items-center justify-between",
  FONT_MEDIUM: "font-medium text-gray-700",
  CHECKBOX_WRAPPER: "flex space-x-6",
  CHECKBOX_LABEL: "flex items-center space-x-2 cursor-pointer",
  CHECKBOX_TEXT: "text-sm text-gray-700",
  CHECKBOX_INPUT: "rounded text-indigo-600",
  SELECT_LABEL: "block text-xs font-medium text-gray-500 uppercase mb-1",
  SELECT_INPUT: "w-full border border-gray-300 rounded text-sm px-2 py-1.5 bg-white text-gray-900",
  TRANSITIONS: {
    BORDER: "border-t pt-4",
    GRID: "grid grid-cols-2 gap-4",
    TITLE: "text-xs font-bold uppercase text-gray-500 mb-1",
    INPUT_WRAPPER: "relative mb-2",
    INPUT: "w-full border border-gray-300 rounded text-xs px-2 py-1",
    DROPDOWN: "absolute z-10 bg-white border shadow-lg w-full max-h-32 overflow-y-auto",
    ITEM: "px-2 py-1 hover:bg-gray-100 cursor-pointer text-xs truncate",
    TAGS: "flex flex-wrap gap-2",
    TAG: (color: 'green' | 'blue' | 'purple') => `bg-${color}-100 text-${color}-800 px-2 py-1 rounded text-xs border border-${color}-200 flex items-center font-medium shadow-sm`,
    CLOSE: (color: 'green' | 'blue' | 'purple') => `ml-1.5 text-${color}-600 hover:text-${color}-900 cursor-pointer flex items-center`
  },
  MOMENT: {
    TITLE: "text-lg font-bold",
    CHECK: "absolute right-2 top-2",
    CHECK_ICON: "text-green-500",
    BTN_CANCEL: "px-3 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm",
    BTN_ADD: "px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm disabled:opacity-50"
  }
};