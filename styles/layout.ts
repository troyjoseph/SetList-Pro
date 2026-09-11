import styled from 'styled-components';

export const LAYOUT = {
  CONTAINER: styled.div.attrs({ className: "flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden" })``,
  SIDEBAR: {
    CONTAINER: styled.div.attrs<{ $isOpen?: boolean }>(props => ({ 
      className: `w-64 bg-white border-r flex flex-col shadow-sm z-30 fixed lg:relative inset-y-0 left-0 transform transition-all duration-300 ease-in-out ${props.$isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:-ml-64'}` 
    }))``,
    OVERLAY: styled.div.attrs<{ $isOpen?: boolean }>(props => ({
      className: `fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 lg:hidden ${props.$isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`
    }))``,
    HEADER: styled.div.attrs({ className: "p-6 border-b flex items-center space-x-3" })``,
    LOGO_BG: styled.div.attrs({ className: "bg-indigo-600 p-2 rounded-lg" })``,
    TITLE: styled.span.attrs({ className: "text-xl font-bold text-gray-800 tracking-tight" })``,
    NAV_CONTAINER: styled.nav.attrs({ className: "flex-1 py-6 space-y-1 overflow-y-auto" })``,
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
  MAIN: styled.main.attrs({ className: "flex-1 flex flex-col overflow-hidden relative w-full" })``,
  MOBILE_HEADER: styled.div.attrs({ className: "flex items-center justify-between p-4 border-b bg-white shrink-0" })``,
  MOBILE_TITLE: styled.div.attrs({ className: "font-bold text-lg text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]" })``,
  SCROLL_AREA: styled.div.attrs({ className: "flex-1 overflow-y-auto" })``
};

export const NAV = {
  BUTTON: styled.button.attrs<{ $active?: boolean }>(props => ({
    className: `flex items-center space-x-2 px-4 py-3 w-full text-left transition-colors ${props.$active ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`
  }))``
};