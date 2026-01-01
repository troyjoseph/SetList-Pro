import React from 'react';
import { ChevronLeft, Wand2, FileDown, Printer } from 'lucide-react';
import { COMMON } from '../../styles/common';
import { EDITOR } from '../../styles/editor';

interface ToolbarProps {
  eventName: string;
  gigType: string;
  onSetup: () => void;
  onAutoFill: () => void;
  onExport: () => void;
  onPrint: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ eventName, gigType, onSetup, onAutoFill, onExport, onPrint }) => (
   <div className={EDITOR.CANVAS.TOOLBAR}>
      <div className={EDITOR.TOOLBAR.LEFT}>
         <button onClick={onSetup} className={EDITOR.TOOLBAR.BTN_BACK}>
            <ChevronLeft size={20} className="mr-1"/> Setup
         </button>
         <div className={EDITOR.TOOLBAR.DIVIDER}></div>
         <h2 className={EDITOR.TOOLBAR.TITLE}>{eventName}</h2>
         <span className={EDITOR.TOOLBAR.BADGE}>{gigType}</span>
      </div>
      <div className={EDITOR.TOOLBAR.RIGHT}>
         <button onClick={onAutoFill} className={EDITOR.TOOLBAR.BTN_AUTOFILL}>
            <Wand2 size={16} className="mr-2"/> Auto-Fill
         </button>
         <COMMON.BUTTON.SECONDARY onClick={onExport}>
            <FileDown size={16} className="mr-2"/> Export CSV
         </COMMON.BUTTON.SECONDARY>
         <button onClick={onPrint} className={EDITOR.TOOLBAR.BTN_PRINT}>
            <Printer size={16} className="mr-2"/> Print View
         </button>
      </div>
   </div>
);