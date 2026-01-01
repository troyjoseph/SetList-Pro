import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { EventDetails } from '../types';
import { COMMON } from '../styles/common';
import { DASHBOARD } from '../styles/dashboard';
import { EventCard } from './dashboard/EventCard';

interface DashboardProps {
  events: EventDetails[];
  onCreateEvent: () => void;
  onSelectEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  onDuplicateEvent: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ events, onCreateEvent, onSelectEvent, onDeleteEvent, onDuplicateEvent }) => (
    <COMMON.PAGE_CONTAINER>
      <COMMON.HEADER_FLEX>
        <div>
           <COMMON.TITLE>Dashboard</COMMON.TITLE>
           <COMMON.SUBTITLE>Manage your upcoming gigs and setlists.</COMMON.SUBTITLE>
        </div>
        <COMMON.BUTTON.PRIMARY_LG onClick={onCreateEvent}>
          <Plus size={20} className="mr-2" /> Create New Event
        </COMMON.BUTTON.PRIMARY_LG>
      </COMMON.HEADER_FLEX>

      {events.length === 0 ? (
        <DASHBOARD.EMPTY_STATE.CONTAINER>
          <DASHBOARD.EMPTY_STATE.ICON>
            <Calendar size={48} />
          </DASHBOARD.EMPTY_STATE.ICON>
          <DASHBOARD.EMPTY_STATE.TITLE>No events yet</DASHBOARD.EMPTY_STATE.TITLE>
          <DASHBOARD.EMPTY_STATE.TEXT>Get started by creating your first event.</DASHBOARD.EMPTY_STATE.TEXT>
          <DASHBOARD.EMPTY_STATE.LINK onClick={onCreateEvent}>Create Event &rarr;</DASHBOARD.EMPTY_STATE.LINK>
        </DASHBOARD.EMPTY_STATE.CONTAINER>
      ) : (
        <DASHBOARD.GRID>
          {events.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onClick={() => onSelectEvent(event.id)} 
              onDelete={() => onDeleteEvent(event.id)}
              onDuplicate={() => onDuplicateEvent(event.id)}
            />
          ))}
        </DASHBOARD.GRID>
      )}
    </COMMON.PAGE_CONTAINER>
);