import React from 'react';
import { EDITOR } from '../../../styles/editor';

interface SongRowProps {
  title: string;
  subtitle: string;
  leftIcon?: React.ReactNode;
  rightControls?: React.ReactNode;
  badges?: React.ReactNode;
  extraContent?: React.ReactNode;
  isEmpty?: boolean;
  emptyText?: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onTitleClick?: () => void;
  className?: string;
}

export const SongRow: React.FC<SongRowProps> = ({
  title, subtitle, leftIcon, rightControls, badges, extraContent,
  isEmpty, emptyText, draggable, onDragStart, onDragOver, onDrop, onTitleClick, className
}) => {
  if (isEmpty) {
    return (
      <div 
        className={`${EDITOR.ROW.BASE_EMPTY} ${className || ''}`}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className={EDITOR.ROW.HANDLE}>{leftIcon}</div>
        <div className={EDITOR.ROW.EMPTY_TEXT}>{emptyText || 'Empty Slot'}</div>
      </div>
    );
  }

  return (
    <div 
      className={`${EDITOR.ROW.BASE} ${className || ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className={EDITOR.ROW.HANDLE}>
        {leftIcon}
      </div>
      
      <div className={EDITOR.ROW.CONTENT}>
         <div className={EDITOR.ROW.TITLE_ROW}>
            {onTitleClick ? (
               <button type="button" onClick={e => { e.stopPropagation(); onTitleClick(); }} className={EDITOR.ROW.TITLE_BTN} title="Edit song details">{title}</button>
            ) : (
               <span className={EDITOR.ROW.TITLE}>{title}</span>
            )}
            {badges}
         </div>
         {onTitleClick ? (
            <button type="button" onClick={e => { e.stopPropagation(); onTitleClick(); }} className={EDITOR.ROW.SUBTITLE_BTN} title="Edit song details">{subtitle}</button>
         ) : (
            <div className={EDITOR.ROW.SUBTITLE}>{subtitle}</div>
         )}
         {extraContent}
      </div>

      <div className={EDITOR.ROW.CONTROLS}>
         {rightControls}
      </div>
    </div>
  );
};
