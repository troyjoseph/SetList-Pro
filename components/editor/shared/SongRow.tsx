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
  className?: string;
}

export const SongRow: React.FC<SongRowProps> = ({
  title, subtitle, leftIcon, rightControls, badges, extraContent, 
  isEmpty, emptyText, draggable, onDragStart, onDragOver, onDrop, className
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
            <span className={EDITOR.ROW.TITLE}>{title}</span>
            {badges}
         </div>
         <div className={EDITOR.ROW.SUBTITLE}>{subtitle}</div>
         {extraContent}
      </div>

      <div className={EDITOR.ROW.CONTROLS}>
         {rightControls}
      </div>
    </div>
  );
};
