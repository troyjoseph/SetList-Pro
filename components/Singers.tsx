import React from 'react';
import { Plus } from 'lucide-react';
import { Singer } from '../types';
import { COMMON } from '../styles/common';
import { SINGERS } from '../styles/singers';
import { SingerCard } from './singers/SingerCard';

interface SingersProps {
  singers: Singer[];
  onAddSinger: () => void;
  onBulkImport: () => void;
  onEditSinger: (singer: Singer) => void;
  onDeleteSinger: (id: string) => void;
}

export const Singers: React.FC<SingersProps> = ({ singers, onAddSinger, onBulkImport, onEditSinger, onDeleteSinger }) => (
    <COMMON.PAGE_CONTAINER>
      <COMMON.HEADER_FLEX>
        <COMMON.TITLE>Singers</COMMON.TITLE>
        <div className="flex gap-2">
            <COMMON.BUTTON.SECONDARY onClick={onBulkImport}>
               Bulk Import
            </COMMON.BUTTON.SECONDARY>
            <COMMON.BUTTON.PRIMARY onClick={onAddSinger}>
              <Plus size={16} className="mr-2" /> Add Singer
            </COMMON.BUTTON.PRIMARY>
        </div>
      </COMMON.HEADER_FLEX>
      <div className={SINGERS.GRID}>
        {singers.map(singer => (
          <SingerCard 
            key={singer.id} 
            singer={singer} 
            onEdit={onEditSinger} 
            onDelete={onDeleteSinger} 
          />
        ))}
      </div>
    </COMMON.PAGE_CONTAINER>
);