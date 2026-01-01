
import React from 'react';
import { Trash2, ArrowRight } from 'lucide-react';
import { EventDetails, Song, Singer } from '../types';
import { COMMON } from '../styles/common';
import { EVENT_SETUP } from '../styles/eventSetup';
import { BasicInfo } from './eventSetup/BasicInfo';
import { SingerSelection } from './eventSetup/SingerSelection';
import { StructureConfig } from './eventSetup/StructureConfig';
import { RequestConfig } from './eventSetup/RequestConfig';

interface EventSetupProps {
  event: EventDetails;
  setEvent: (e: EventDetails) => void;
  songs: Song[];
  singers: Singer[];
  onDelete: () => void;
  onSave: () => void;
}

export const EventSetup: React.FC<EventSetupProps> = ({ event, setEvent, songs, singers, onDelete, onSave }) => {
    
    const handleQuotaChange = (id: string, quota: number | undefined) => {
        const newQuotas = { ...(event.singerQuotas || {}) };
        if (quota === undefined || quota <= 0) {
            delete newQuotas[id];
        } else {
            newQuotas[id] = quota;
        }
        setEvent({ ...event, singerQuotas: newQuotas });
    };

    return (
      <COMMON.PAGE_CONTAINER>
        <COMMON.HEADER_FLEX>
           <div>
             <COMMON.TITLE>Event Setup</COMMON.TITLE>
             <COMMON.SUBTITLE>Configure event details and parameters.</COMMON.SUBTITLE>
           </div>
           <COMMON.BUTTON.DANGER 
             onClick={onDelete} 
             type="button"
           >
             <Trash2 size={18} className="mr-1 pointer-events-none" /> Delete Event
           </COMMON.BUTTON.DANGER>
        </COMMON.HEADER_FLEX>

        <div className={EVENT_SETUP.FORM_CONTAINER}>
           <BasicInfo event={event} setEvent={setEvent} />
           
           <SingerSelection 
              allSingers={singers} 
              selectedIds={event.selectedSingerIds} 
              singerQuotas={event.singerQuotas || {}}
              onChange={(ids) => setEvent({ ...event, selectedSingerIds: ids })} 
              onQuotaChange={handleQuotaChange}
           />
           
           <StructureConfig event={event} setEvent={setEvent} />
           
           <RequestConfig 
              event={event} 
              setEvent={setEvent} 
              songs={songs} 
              singers={singers}
           />
        </div>

        <div className={EVENT_SETUP.FOOTER_BTN_WRAPPER}>
           <COMMON.BUTTON.PRIMARY_LG 
             onClick={onSave}
           >
             Save & Open Editor <ArrowRight className="ml-2" />
           </COMMON.BUTTON.PRIMARY_LG>
        </div>
      </COMMON.PAGE_CONTAINER>
    );
};
