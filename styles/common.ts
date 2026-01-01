import styled from 'styled-components';

export const COMMON = {
  PAGE_CONTAINER: styled.div.attrs({ className: "p-8 max-w-6xl mx-auto h-full flex flex-col" })``,
  HEADER_FLEX: styled.div.attrs({ className: "flex justify-between items-center mb-6" })``,
  TITLE: styled.h1.attrs({ className: "text-3xl font-bold text-gray-800" })``,
  SUBTITLE: styled.p.attrs({ className: "text-gray-500 mt-1" })``,
  HIDDEN: "hidden", // Helper string for inputs remains useful as string
  
  BUTTON: {
    PRIMARY: styled.button.attrs({ className: "bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed" })``,
    PRIMARY_LG: styled.button.attrs({ className: "bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center font-medium" })``,
    SECONDARY: styled.button.attrs({ className: "px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center transition-colors shadow-sm text-sm font-medium" })``,
    DANGER: styled.button.attrs({ className: "text-red-500 hover:text-red-700 font-medium flex items-center" })``,
    PRIMARY_DANGER: styled.button.attrs({ className: "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium shadow-sm transition-colors flex items-center justify-center" })``,
    ICON: styled.button.attrs({ className: "p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" })``,
    ICON_DANGER: styled.button.attrs({ className: "p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" })``,
    GHOST: styled.button.attrs({ className: "text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors" })``
  },

  INPUT: {
    BASE: styled.input.attrs({ className: "w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" })``,
    SELECT: styled.select.attrs({ className: "w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" })``,
    FLEX_BASE: styled.input.attrs({ className: "w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1" })``,
    SEARCH_WRAPPER: styled.div.attrs({ className: "relative max-w-md w-full" })``,
    SEARCH_ICON: styled.div.attrs({ className: "absolute left-3 top-2.5 text-gray-400" })``,
    SEARCH_FIELD: styled.input.attrs({ className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:border-indigo-500" })``
  },

  LABEL: styled.label.attrs({ className: "block text-sm font-medium text-gray-700 mb-1" })``,
  
  BADGE: {
    SLOW: styled.span.attrs({ className: "bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded" })``,
    DUET: styled.span.attrs({ className: "bg-pink-100 text-pink-700 text-[10px] px-1.5 py-0.5 rounded" })``,
    TAG: styled.span.attrs({ className: "bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600" })``
  },

  STAR: {
    CONTAINER: styled.div.attrs({ className: "flex space-x-0.5" })``,
    // Dynamic styles still handled best via function class generation in usage or transient props
    ICON: (active: boolean) => `cursor-pointer ${active ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`
  }
};