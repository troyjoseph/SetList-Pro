import React from 'react';
import { EventDetails, GigType } from '../../types';
import { COMMON } from '../../styles/common';
import { EVENT_SETUP } from '../../styles/eventSetup';

interface BasicInfoProps {
  event: EventDetails;
  setEvent: (e: EventDetails) => void;
}

export const BasicInfo: React.FC<BasicInfoProps> = ({ event, setEvent }) => (
   <div className={EVENT_SETUP.GRID_2}>
      <div className={EVENT_SETUP.COL_SPAN_2}>
         <COMMON.LABEL>Event Name</COMMON.LABEL>
         <COMMON.INPUT.BASE 
           type="text" 
           value={event.name} 
           onChange={e => setEvent({...event, name: e.target.value})} 
         />
      </div>
      <div>
         <COMMON.LABEL>Date</COMMON.LABEL>
         <COMMON.INPUT.BASE 
           type="date" 
           value={event.date} 
           onChange={e => setEvent({...event, date: e.target.value})} 
         />
      </div>
      <div>
         <COMMON.LABEL>Gig Type</COMMON.LABEL>
         <COMMON.INPUT.SELECT 
           value={event.gigType} 
           onChange={e => setEvent({...event, gigType: e.target.value as GigType})} 
         >
            {Object.values(GigType).map(t => <option key={t} value={t}>{t}</option>)}
         </COMMON.INPUT.SELECT>
      </div>
      <div>
         <COMMON.LABEL>Start Time</COMMON.LABEL>
         <COMMON.INPUT.BASE 
           type="time" 
           value={event.startTime} 
           onChange={e => setEvent({...event, startTime: e.target.value})} 
         />
      </div>
      <div>
         <COMMON.LABEL>End Time</COMMON.LABEL>
         <COMMON.INPUT.BASE 
           type="time" 
           value={event.endTime} 
           onChange={e => setEvent({...event, endTime: e.target.value})} 
         />
      </div>
   </div>
);