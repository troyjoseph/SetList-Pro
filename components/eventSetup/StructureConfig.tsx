import React from 'react';
import { ListMusic } from 'lucide-react';
import { EventDetails } from '../../types';
import { COMMON } from '../../styles/common';
import { EVENT_SETUP } from '../../styles/eventSetup';

interface StructureConfigProps {
  event: EventDetails;
  setEvent: (e: EventDetails) => void;
}

export const StructureConfig: React.FC<StructureConfigProps> = ({ event, setEvent }) => {
    const calculateEstimatedSongs = (minutes: number) => {
        return Math.ceil(minutes / 4) + 1;
    };

    return (
       <div className={EVENT_SETUP.SECTION_DIVIDER}>
          <h3 className={EVENT_SETUP.SECTION_HEADER}>
             <ListMusic size={20} className="mr-2" /> Set Structure
          </h3>
          <div className={EVENT_SETUP.GRID_3}>
             <div>
                <COMMON.LABEL>Number of Sets</COMMON.LABEL>
                <COMMON.INPUT.BASE 
                  type="number" min="1" max="10"
                  value={event.numberOfSets}
                  onChange={e => setEvent({...event, numberOfSets: parseInt(e.target.value)})}
                />
             </div>
             <div className={EVENT_SETUP.COL_SPAN_2}>
                <COMMON.LABEL className="mb-2">Structure Type</COMMON.LABEL>
                <div className={EVENT_SETUP.RADIO_GROUP}>
                   <label className={EVENT_SETUP.RADIO_LABEL}>
                      <input 
                        type="radio" 
                        name="setType"
                        checked={event.setLengthType === 'TIME'}
                        onChange={() => setEvent({...event, setLengthType: 'TIME'})}
                        className="mr-2 text-indigo-600"
                      />
                      <span className={EVENT_SETUP.RADIO_TEXT}>Time Based (Minutes)</span>
                   </label>
                   <label className={EVENT_SETUP.RADIO_LABEL}>
                      <input 
                        type="radio" 
                        name="setType"
                        checked={event.setLengthType === 'SONG_COUNT'}
                        onChange={() => setEvent({...event, setLengthType: 'SONG_COUNT'})}
                        className="mr-2 text-indigo-600"
                      />
                      <span className={EVENT_SETUP.RADIO_TEXT}>Song Count</span>
                   </label>
                </div>
                <div className={EVENT_SETUP.INPUT_CONTAINER}>
                  {event.setLengthType === 'TIME' ? (
                      <div className={EVENT_SETUP.TIME_INPUT_WRAPPER}>
                         <input 
                           type="number"
                           value={event.minutesPerSet}
                           onChange={e => setEvent({...event, minutesPerSet: parseInt(e.target.value)})}
                           className={EVENT_SETUP.TIME_INPUT}
                         />
                         <span className={EVENT_SETUP.TEXT_DESC}>minutes per set</span>
                         <span className={EVENT_SETUP.TEXT_DESC_SMALL}>(Approx. {calculateEstimatedSongs(event.minutesPerSet || 45)} songs)</span>
                      </div>
                  ) : (
                      <div className={EVENT_SETUP.TIME_INPUT_WRAPPER}>
                         <input 
                           type="number"
                           value={event.songsPerSet}
                           onChange={e => setEvent({...event, songsPerSet: parseInt(e.target.value)})}
                           className={EVENT_SETUP.TIME_INPUT}
                         />
                         <span className={EVENT_SETUP.TEXT_DESC}>songs per set</span>
                      </div>
                  )}
                </div>
             </div>
          </div>
       </div>
    );
};