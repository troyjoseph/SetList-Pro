import styled from 'styled-components';

export const LAYOUT = {
  CONTAINER: styled.div.attrs({ className: "flex h-screen bg-gray-50 text-gray-900 font-sans" })``,
  SIDEBAR: {
    CONTAINER: styled.div.attrs({ className: "w-64 bg-white border-r flex flex-col shadow-sm z-20" })``,
    HEADER: styled.div.attrs({ className: "p-6 border-b flex items-center space-x-3" })``,
    LOGO_BG: styled.div.attrs({ className: "bg-indigo-600 p-2 rounded-lg" })``,
    TITLE: styled.span.attrs({ className: "text-xl font-bold text-gray-800 tracking-tight" })``,
    NAV_CONTAINER: styled.nav.attrs({ className: "flex-1 py-6 space-y-1" })``,
    EVENT_SECTION: styled.div.attrs({ className: "pt-4 mt-4 border-t px-4" })``,
    EVENT_LABEL: styled.div.attrs({ className: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" })``,
    // Using transient prop $isActive to handle conditional styling
    EVENT_BUTTON: styled.button.attrs<{ $isActive?: boolean }>(props => ({
      className: `w-full text-left p-3 rounded-lg border transition-all ${props.$isActive ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`
    }))``,
    EVENT_NAME: styled.div.attrs({ className: "font-medium text-sm truncate" })``,
    EVENT_DATE_WRAPPER: styled.div.attrs({ className: "text-xs text-gray-400 mt-1 flex items-center" })``,
    EVENT_ICON: styled.span.attrs({ className: "mr-1" })``,
    FOOTER: styled.div.attrs({ className: "p-4 border-t" })``
  },
  MAIN: styled.main.attrs({ className: "flex-1 flex flex-col overflow-hidden relative" })``,
  SCROLL_AREA: styled.div.attrs({ className: "flex-1 overflow-y-auto" })``
};

export const NAV = {
  BUTTON: styled.button.attrs<{ $active?: boolean }>(props => ({
    className: `flex items-center space-x-2 px-4 py-3 w-full text-left transition-colors ${props.$active ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`
  }))``
};