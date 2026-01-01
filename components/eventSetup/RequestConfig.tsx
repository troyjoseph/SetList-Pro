
import React from 'react';
import { Star } from 'lucide-react';
import { EventDetails, Song, RequestItem, Singer } from '../../types';
import { EVENT_SETUP } from '../../styles/eventSetup';
import { RequestSection } from './requestConfig/RequestSection';

interface RequestConfigProps {
  event: EventDetails;
  setEvent: (e: EventDetails) => void;
  songs: Song[];
  singers: Singer[];
}

export const RequestConfig: React.FC<RequestConfigProps> = ({ event, setEvent, songs, singers }) => {
    
    const addItem = (listKey: 'mustPlay' | 'doNotPlay' | 'softRequests', item: RequestItem) => {
        const list = event[listKey] || [];
        // Check for duplicates
        if (!list.some(i => i.value === item.value && i.type === item.type)) {
            setEvent({ ...event, [listKey]: [...list, item] });
        }
    };

    const removeItem = (listKey: 'mustPlay' | 'doNotPlay' | 'softRequests', index: number) => {
        const list = event[listKey] || [];
        setEvent({ ...event, [listKey]: list.filter((_, i) => i !== index) });
    };

    const updateItem = (listKey: 'mustPlay' | 'doNotPlay' | 'softRequests', index: number, updates: Partial<RequestItem>) => {
        const list = [...(event[listKey] || [])];
        list[index] = { ...list[index], ...updates };
        setEvent({ ...event, [listKey]: list });
    };

    // Filter active singers for assignment options
    const activeSingers = singers.filter(s => event.selectedSingerIds.includes(s.id));

    return (
       <div className={EVENT_SETUP.SECTION_DIVIDER}>
          <h3 className={EVENT_SETUP.SECTION_HEADER}>
             <Star size={20} className="mr-2" /> Requests & Restrictions
          </h3>
          <div className={EVENT_SETUP.GRID_GAP_8}>
             <RequestSection 
                title="Must Play" 
                type="MUST" 
                items={event.mustPlay} 
                onAdd={item => addItem('mustPlay', item)}
                onRemove={idx => removeItem('mustPlay', idx)}
                onUpdate={(idx, updates) => updateItem('mustPlay', idx, updates)}
                songs={songs}
                singers={activeSingers}
             />
             <RequestSection 
                title="Soft Requests (Good to have)" 
                type="SOFT" 
                items={event.softRequests || []} 
                onAdd={item => addItem('softRequests', item)}
                onRemove={idx => removeItem('softRequests', idx)}
                onUpdate={(idx, updates) => updateItem('softRequests', idx, updates)}
                songs={songs}
                singers={activeSingers}
             />
             <RequestSection 
                title="Do Not Play" 
                type="DO_NOT" 
                items={event.doNotPlay} 
                onAdd={item => addItem('doNotPlay', item)}
                onRemove={idx => removeItem('doNotPlay', idx)}
                songs={songs}
             />
          </div>
       </div>
    );
};
