import React from 'react';
import { Calendar, ArrowRight, Trash2, Copy } from 'lucide-react';
import { EventDetails } from '../../types';
import { COMMON } from '../../styles/common';
import { DASHBOARD } from '../../styles/dashboard';

interface EventCardProps {
  event: EventDetails;
  onClick: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick, onDelete, onDuplicate }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDuplicate();
  };

  return (
    <DASHBOARD.CARD.CONTAINER onClick={onClick}>
      <DASHBOARD.CARD.HEADER>
        <DASHBOARD.CARD.ICON_BOX>
          <Calendar size={24} />
        </DASHBOARD.CARD.ICON_BOX>
        <div className="flex items-start space-x-2">
           <DASHBOARD.CARD.DATE_BOX>
             <DASHBOARD.CARD.DATE_MAIN>
               {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
             </DASHBOARD.CARD.DATE_MAIN>
             <DASHBOARD.CARD.DATE_SUB>{new Date(event.date).getFullYear()}</DASHBOARD.CARD.DATE_SUB>
           </DASHBOARD.CARD.DATE_BOX>
           
           <COMMON.BUTTON.ICON 
              type="button"
              onClick={handleDuplicate}
              className="relative z-10"
              title="Duplicate Event"
           >
              <Copy size={16} className="pointer-events-none" />
           </COMMON.BUTTON.ICON>

           <COMMON.BUTTON.ICON_DANGER 
              type="button"
              onClick={handleDelete}
              className="relative z-10"
              title="Delete Event"
           >
              <Trash2 size={16} className="pointer-events-none" />
           </COMMON.BUTTON.ICON_DANGER>
        </div>
      </DASHBOARD.CARD.HEADER>
      <DASHBOARD.CARD.TITLE>{event.name}</DASHBOARD.CARD.TITLE>
      <DASHBOARD.CARD.META>
        <COMMON.BADGE.TAG className="mr-2">{event.gigType}</COMMON.BADGE.TAG>
        <span>{event.sets.length} Sets</span>
      </DASHBOARD.CARD.META>
      <DASHBOARD.CARD.FOOTER>
        <span className="text-gray-400">Edited recently</span>
        <DASHBOARD.CARD.ARROW>
           <ArrowRight size={16} />
        </DASHBOARD.CARD.ARROW>
      </DASHBOARD.CARD.FOOTER>
    </DASHBOARD.CARD.CONTAINER>
  );
};