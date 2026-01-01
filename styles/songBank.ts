export const SONGBANK = {
  TABLE_CONTAINER: "bg-white rounded-xl shadow-sm border flex flex-col flex-1 overflow-hidden",
  CONTROLS: {
    CONTAINER: "p-4 border-b bg-gray-50 flex justify-between items-center",
    SELECT: "border border-gray-300 rounded-md text-sm py-1.5 px-3 bg-white text-gray-900",
    LABEL: "text-sm text-gray-500 mr-2"
  },
  QUICK_ADD: {
    WRAPPER: "flex space-x-2",
    INPUT_WRAPPER: "relative",
    INPUT: "border border-gray-300 rounded-l-md px-4 py-2 w-64 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500",
    BUTTON: "absolute right-0 top-0 bottom-0 bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
  },
  TABLE: {
    WRAPPER: "flex-1 overflow-y-auto",
    BASE: "w-full text-left border-collapse",
    HEAD: "bg-gray-50 sticky top-0 z-10 text-xs font-semibold text-gray-500 uppercase tracking-wider",
    TH: "px-6 py-3 border-b",
    ROW: "hover:bg-gray-50 group",
    TD: "px-6 py-3",
    FOOTER: "p-3 border-t bg-gray-50 text-xs text-gray-500 text-right",
    TAGS: "flex justify-center space-x-1",
    RATING: "flex justify-center",
    ACTIONS: "flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity",
    EMPTY: "text-center py-12 text-gray-400"
  }
};