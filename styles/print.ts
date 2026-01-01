export const PRINT = {
  CONTAINER: "bg-white min-h-screen text-black p-8 font-sans max-w-5xl mx-auto",
  CONTROLS: "no-print flex justify-between mb-8 bg-gray-100 p-4 rounded-lg",
  BUTTON_BACK: "flex items-center text-gray-600 hover:text-gray-900",
  BUTTON_PRINT: "bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 flex items-center",
  
  HEADER: "text-center mb-8 border-b-2 border-black pb-4",
  TITLE_MAIN: "text-4xl font-bold uppercase tracking-wider mb-2",
  TITLE_SUB: "text-xl font-semibold",
  META: "text-sm mt-1",
  END_TIME: "text-center font-bold text-lg mb-12",

  TABLE_HEADER: "grid grid-cols-12 gap-4 border-b-2 border-black font-bold text-sm uppercase tracking-wide mb-2 pb-1",
  ROW: "grid grid-cols-12 gap-4 py-2 border-b border-gray-200 text-sm items-center",
  
  MOMENTS: {
    CONTAINER: "mb-8",
    TITLE: "font-bold text-lg uppercase mb-2 border-b border-gray-300 pb-1",
    BADGE: "ml-2 text-xs font-normal italic bg-gray-100 px-1 rounded"
  },

  SET_CONTAINER: "mb-8 break-inside-avoid",
  SET_HEADER: "flex justify-between items-end border-b border-black mb-2 pb-1",
  SET_TITLE: "font-bold text-xl uppercase",
  
  KEY_BADGE: (highlight: boolean, color: string) => `font-mono px-1 rounded border border-transparent ${highlight ? `bg-${color}-200 border-${color}-400 font-bold print-color-adjust` : ''}`,
  TIMESTAMP: "ml-3 font-mono font-normal text-gray-500 bg-gray-50 px-1 rounded text-xs",

  DNP_BOX: "border-t-4 border-double border-gray-300 pt-4 break-inside-avoid",
  DNP_TITLE: "font-bold text-red-700 uppercase mb-2 flex items-center",
  DNP_TAG: "bg-red-50 border border-red-200 text-red-800 px-3 py-1 rounded text-sm font-semibold"
};