import React from 'react';
import { ChevronLeft, Wand2, FileDown, Printer, Menu, ListMusic } from 'lucide-react';
import { COMMON } from '../../styles/common';
import { EDITOR } from '../../styles/editor';

interface ToolbarProps {
  eventName: string;
  gigType: string;
  onSetup: () => void;
  onAutoFill: () => void;
  onExport: () => void;
  onPrint: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onOpenAppSidebar?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ eventName, gigType, onSetup, onAutoFill, onExport, onPrint, isSidebarOpen, onToggleSidebar, onOpenAppSidebar }) => (
   <div className={EDITOR.CANVAS.TOOLBAR}>
      <div className={EDITOR.TOOLBAR.LEFT}>
         {onOpenAppSidebar && (
           <button onClick={onOpenAppSidebar} className="mr-2 p-2 text-gray-600 hover:text-gray-900 shrink-0 flex items-center justify-center">
             <Menu size={24} />
           </button>
         )}
         {onToggleSidebar && (
           <button onClick={onToggleSidebar} className="mr-2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-md shrink-0 flex items-center gap-1 font-medium text-sm transition-colors" title={isSidebarOpen ? "Hide Songs" : "Show Songs"}>
             <ListMusic size={18} />
             <span className="hidden sm:inline">Songs</span>
           </button>
         )}
         <button onClick={onSetup} className={EDITOR.TOOLBAR.BTN_BACK}>
            <ChevronLeft size={20} className="sm:mr-1"/> <span className="hidden sm:inline">Setup</span>
         </button>
         <div className={EDITOR.TOOLBAR.DIVIDER}></div>
         <h2 className={EDITOR.TOOLBAR.TITLE}>{eventName}</h2>
         <span className={EDITOR.TOOLBAR.BADGE}>{gigType}</span>
      </div>
      <div className={EDITOR.TOOLBAR.RIGHT}>
         <button onClick={onAutoFill} className={EDITOR.TOOLBAR.BTN_AUTOFILL} title="Auto-Fill">
            <Wand2 size={16} className="sm:mr-2"/> <span className="hidden sm:inline">Auto-Fill</span>
         </button>
         <COMMON.BUTTON.SECONDARY onClick={onExport} title="Export CSV">
            <FileDown size={16} className="sm:mr-2"/> <span className="hidden sm:inline">Export CSV</span>
         </COMMON.BUTTON.SECONDARY>
         <button onClick={onPrint} className={EDITOR.TOOLBAR.BTN_PRINT} title="Print View">
            <Printer size={16} className="sm:mr-2"/> <span className="hidden sm:inline">Print View</span>
         </button>
      </div>
   </div>
);