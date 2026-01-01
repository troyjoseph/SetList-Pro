
export const EVENT_SETUP = {
  FORM_CONTAINER: "bg-white rounded-xl shadow-sm border p-6 space-y-8 flex-1 overflow-y-auto",
  GRID_2: "grid grid-cols-1 md:grid-cols-2 gap-6",
  GRID_3: "grid grid-cols-1 md:grid-cols-3 gap-6",
  GRID_GAP_8: "grid grid-cols-1 md:grid-cols-2 gap-8",
  COL_SPAN_2: "col-span-2",
  SECTION_DIVIDER: "border-t pt-6",
  SECTION_HEADER: "text-lg font-semibold text-gray-800 mb-4 flex items-center",
  
  // Singer Cards
  SINGER_CARD: (selected: boolean) => `border rounded-lg p-3 transition-all flex flex-col ${selected ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500' : 'bg-white hover:bg-gray-50 border-gray-200'}`,
  SINGER_HEADER: "flex items-start cursor-pointer mb-2",
  SINGER_INFO: "ml-3",
  SINGER_NAME: "font-medium text-sm text-gray-900",
  SINGER_RANGE: "text-xs text-gray-500",
  QUOTA_WRAPPER: "flex items-center mt-auto pt-2 border-t border-indigo-100",
  QUOTA_LABEL: "text-xs text-gray-600 mr-auto font-medium",
  QUOTA_INPUT: "w-20 text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400",

  CHECKBOX_LABEL: (checked: boolean) => `flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${checked ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500' : 'hover:bg-gray-50'}`,
  CHECKBOX_TEXT_MAIN: "font-medium text-sm text-gray-900",
  CHECKBOX_TEXT_SUB: "text-xs text-gray-500",
  RADIO_GROUP: "flex space-x-4",
  RADIO_LABEL: "flex items-center cursor-pointer",
  RADIO_TEXT: "text-sm",
  REQUEST_ITEM: (type: 'MUST' | 'DO_NOT' | 'SOFT') => `bg-${type === 'MUST' ? 'green' : type === 'SOFT' ? 'blue' : 'red'}-50 text-${type === 'MUST' ? 'green' : type === 'SOFT' ? 'blue' : 'red'}-700 px-2 py-1 rounded text-xs border border-${type === 'MUST' ? 'green' : type === 'SOFT' ? 'blue' : 'red'}-200 flex items-center`,
  DROPDOWN: "absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto",
  DROPDOWN_ITEM: "px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm",
  DROPDOWN_TYPE_LABEL: "font-semibold text-gray-700 mr-1",
  DROPDOWN_SUB: "text-gray-400 text-xs ml-1",
  
  // Request Rows (Must/Soft Play)
  REQUEST_ROW: "flex flex-col p-3 bg-gray-50 rounded border border-gray-200 mb-2",
  REQUEST_ROW_HEADER: "flex items-center justify-between mb-2",
  REQUEST_INFO: "flex items-center",
  REQUEST_LABEL: "font-medium text-gray-900 text-sm",
  REQUEST_CONTROLS: "grid grid-cols-2 gap-3",
  REQUEST_CONTROL_GROUP: "flex flex-col",
  REQUEST_CONTROL_LABEL: "text-[10px] text-gray-500 uppercase font-semibold mb-0.5",
  REQUEST_INPUT: "text-xs border border-gray-300 rounded px-2 py-1.5 w-full bg-white text-gray-900",
  REQUEST_SELECT: "text-xs border border-gray-300 rounded px-2 py-1.5 w-full bg-white text-gray-900",
  
  // New
  TIME_INPUT_WRAPPER: "flex items-center space-x-2",
  TIME_INPUT: "w-24 border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-900",
  TEXT_DESC: "text-sm text-gray-600",
  TEXT_DESC_SMALL: "text-xs text-gray-400 ml-2",
  INPUT_CONTAINER: "mt-3",
  
  REQ_TITLE_MUST: "text-sm font-bold text-green-700 uppercase mb-2",
  REQ_TITLE_SOFT: "text-sm font-bold text-blue-700 uppercase mb-2",
  REQ_TITLE_DNP: "text-sm font-bold text-red-700 uppercase mb-2",
  REQ_INPUT_WRAPPER: "relative mb-2",
  REQ_INPUT: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white text-gray-900",
  TAGS_WRAPPER: "flex flex-wrap gap-2",
  TAG_CLOSE_BTN: "ml-1 hover:text-green-900", 
  TAG_CLOSE_BTN_BLUE: "ml-1 hover:text-blue-900",
  TAG_CLOSE_BTN_RED: "ml-1 hover:text-red-900",
  
  FOOTER_BTN_WRAPPER: "mt-8 flex justify-end"
};
