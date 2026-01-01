import React from 'react';
import { Users, Edit2, Trash2 } from 'lucide-react';
import { Singer } from '../../types';
import { COMMON } from '../../styles/common';
import { SINGERS } from '../../styles/singers';

interface SingerCardProps {
  singer: Singer;
  onEdit: (singer: Singer) => void;
  onDelete: (id: string) => void;
}

export const SingerCard: React.FC<SingerCardProps> = ({ singer, onEdit, onDelete }) => {
  
  const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onDelete(singer.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onEdit(singer);
  };

  return (
    <div className={SINGERS.CARD.CONTAINER}>
      <div className={SINGERS.CARD.HEADER}>
        <div className={SINGERS.CARD.INFO}>
          <div className={SINGERS.CARD.ICON}><Users size={24} /></div>
          <div className="min-w-0">
            <h3 className={SINGERS.CARD.NAME} title={singer.name}>{singer.name}</h3>
            <div className={SINGERS.CARD.RANGE}>{singer.range}</div>
          </div>
        </div>
        <div className={SINGERS.CARD.ACTIONS}>
          <COMMON.BUTTON.ICON 
              type="button"
              onClick={handleEdit}
              title="Edit Singer"
          >
              <Edit2 size={16} className="pointer-events-none" />
          </COMMON.BUTTON.ICON>
          <COMMON.BUTTON.ICON_DANGER 
              type="button"
              onClick={handleDelete}
              title="Delete Singer"
          >
              <Trash2 size={16} className="pointer-events-none" />
          </COMMON.BUTTON.ICON_DANGER>
        </div>
      </div>
      <div className={SINGERS.CARD.STATS}>
        <div className={SINGERS.CARD.STATS_ROW}>
          <span className={SINGERS.CARD.STATS_LABEL}>Repertoire Size</span>
          <span className={SINGERS.CARD.STATS_VALUE}>{Object.keys(singer.repertoire).length} songs</span>
        </div>
      </div>
    </div>
  );
};