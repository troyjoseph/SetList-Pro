import styled from 'styled-components';

export const DASHBOARD = {
  EMPTY_STATE: {
    CONTAINER: styled.div.attrs({ className: "text-center py-20 bg-white rounded-xl border border-dashed border-gray-300" })``,
    ICON: styled.div.attrs({ className: "mx-auto text-gray-300 mb-4 inline-block" })``,
    TITLE: styled.h3.attrs({ className: "text-lg font-medium text-gray-900" })``,
    TEXT: styled.p.attrs({ className: "text-gray-500 mt-1 mb-6" })``,
    LINK: styled.button.attrs({ className: "text-indigo-600 font-medium hover:text-indigo-800" })``
  },
  GRID: styled.div.attrs({ className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" })``,
  CARD: {
    CONTAINER: styled.div.attrs({ className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group" })``,
    HEADER: styled.div.attrs({ className: "flex justify-between items-start mb-4" })``,
    ICON_BOX: styled.div.attrs({ className: "bg-indigo-50 p-3 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors" })``,
    DATE_BOX: styled.div.attrs({ className: "text-right" })``,
    DATE_MAIN: styled.div.attrs({ className: "text-sm font-bold text-gray-900" })``,
    DATE_SUB: styled.div.attrs({ className: "text-xs text-gray-500" })``,
    TITLE: styled.h3.attrs({ className: "text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors" })``,
    META: styled.div.attrs({ className: "flex items-center text-sm text-gray-500 mb-4" })``,
    FOOTER: styled.div.attrs({ className: "pt-4 border-t flex justify-between items-center text-sm" })``,
    ARROW: styled.span.attrs({ className: "text-gray-300 group-hover:text-indigo-600 transition-colors" })``
  }
};