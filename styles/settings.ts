import styled from 'styled-components';
import { COMMON } from './common';

export const SETTINGS = {
  CONTAINER: "p-8 max-w-4xl mx-auto",
  SECTION: "bg-white p-6 rounded-xl shadow-sm border",
  SECTION_HEADER: "text-lg font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center",
  GRID: "grid grid-cols-1 md:grid-cols-2 gap-6",
  MOMENT_TAG: "bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center border border-purple-100",
  COLOR_BTN: (color: string, active: boolean) => `w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-gray-600 scale-110' : 'border-transparent hover:scale-105'}`,
  COLOR_DOT: (color: string, active: boolean) => `w-6 h-6 rounded-full bg-${color}-400 ${active ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`,
  DATA_BOX: "bg-white p-6 rounded-xl shadow-sm border border-indigo-100",
  DATA_HEADER: "text-lg font-semibold mb-4 text-indigo-900 border-b border-indigo-100 pb-2 flex items-center",
  DATA_DESC: "text-sm text-gray-500",
  DATA_WARNING: "mt-4 bg-yellow-50 p-3 rounded-md flex items-start text-sm text-yellow-800 border border-yellow-200",
  WARNING_TEXT: "text-red-500 font-semibold",
  
  // New
  SUB_SECTION: "space-y-2",
  SUB_SECTION_BORDER: "space-y-2 border-l pl-0 md:pl-6 border-gray-100",
  SUB_HEADER: "font-medium text-gray-900",
  // Re-defined as a standalone styled label to avoid object concatenation errors
  FILE_INPUT_LABEL: styled.label.attrs({
    className: "px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center transition-colors shadow-sm text-sm font-medium w-fit cursor-pointer"
  })``,
  VISUAL_GRID: "flex flex-wrap gap-3",
  VISUAL_DESC: "text-xs text-gray-500 mt-2",
  MOMENT_INPUT_WRAPPER: "flex space-x-2 mb-4",
  MOMENT_ADD_BTN: "bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700",
  MOMENT_TAGS: "flex flex-wrap gap-2",
  MOMENT_CLOSE: "ml-2 text-purple-400 hover:text-purple-900"
};