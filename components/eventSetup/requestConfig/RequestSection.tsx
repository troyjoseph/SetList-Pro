
import React, { useState } from 'react';
import { X, Music, User } from 'lucide-react';
import { RequestItem, Song, Singer } from '../../../types';
import { EVENT_SETUP } from '../../../styles/eventSetup';
import { SearchDropdown } from './SearchDropdown';

interface RequestSectionProps {
  title: string;
  type: 'MUST' | 'DO_NOT' | 'SOFT';
  items: RequestItem[];
  onAdd: (item: RequestItem) => void;
  onRemove: (index: number) => void;
  onUpdate?: (index: number, updates: Partial<RequestItem>) => void;
  songs: Song[];
  singers?: Singer[];
}

export const RequestSection: React.FC<RequestSectionProps> = ({ title, type, items, onAdd, onRemove, onUpdate, songs, singers }) => {
  const [search, setSearch] = useState('');

  const handleSelect = (item: RequestItem) => {
    onAdd(item);
    setSearch('');
  };

  let titleClass = EVENT_SETUP.REQ_TITLE_MUST;
  if (type === 'DO_NOT') titleClass = EVENT_SETUP.REQ_TITLE_DNP;
  if (type === 'SOFT') titleClass = EVENT_SETUP.REQ_TITLE_SOFT;

  let closeBtnClass = EVENT_SETUP.TAG_CLOSE_BTN;
  if (type === 'DO_NOT') closeBtnClass = EVENT_SETUP.TAG_CLOSE_BTN_RED;
  if (type === 'SOFT') closeBtnClass = EVENT_SETUP.TAG_CLOSE_BTN_BLUE;

  return (
    <div>
      <h4 className={titleClass}>{title}</h4>
      <div className={EVENT_SETUP.REQ_INPUT_WRAPPER}>
        <input 
          type="text" 
          placeholder="Add song or artist..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={EVENT_SETUP.REQ_INPUT}
        />
        <SearchDropdown search={search} songs={songs} onSelect={handleSelect} />
      </div>

      {type === 'DO_NOT' ? (
          <div className={EVENT_SETUP.TAGS_WRAPPER}>
             {items.map((item, idx) => (
                <span key={idx} className={EVENT_SETUP.REQUEST_ITEM(type)}>
                   {item.type === 'ARTIST' ? `(Artist) ${item.label}` : item.label}
                   <button onClick={() => onRemove(idx)} className={closeBtnClass}>
                     <X size={12}/>
                   </button>
                </span>
             ))}
          </div>
      ) : (
          <div className="space-y-2">
             {items.map((item, idx) => (
                <div key={idx} className={EVENT_SETUP.REQUEST_ROW}>
                   <div className={EVENT_SETUP.REQUEST_ROW_HEADER}>
                      <div className={EVENT_SETUP.REQUEST_INFO}>
                         {item.type === 'ARTIST' && <User size={12} className="mr-1 text-gray-400" />}
                         {item.type === 'SONG' && <Music size={12} className="mr-1 text-gray-400" />}
                         <span className={EVENT_SETUP.REQUEST_LABEL}>
                            {item.label} <span className="text-gray-400 font-normal text-xs ml-1">{item.type === 'ARTIST' ? '(All songs by artist)' : ''}</span>
                         </span>
                      </div>
                      <button onClick={() => onRemove(idx)} className="text-gray-400 hover:text-red-600">
                         <X size={14}/>
                      </button>
                   </div>
                   
                   <div className={EVENT_SETUP.REQUEST_CONTROLS}>
                      <div className={EVENT_SETUP.REQUEST_CONTROL_GROUP}>
                          <label className={EVENT_SETUP.REQUEST_CONTROL_LABEL}>Placement Guideline</label>
                          <input 
                              type="text" 
                              placeholder="e.g. Set 1, Early" 
                              value={item.placementGuideline || ''}
                              onChange={(e) => onUpdate && onUpdate(idx, { placementGuideline: e.target.value })}
                              className={EVENT_SETUP.REQUEST_INPUT}
                          />
                      </div>
                      <div className={EVENT_SETUP.REQUEST_CONTROL_GROUP}>
                          <label className={EVENT_SETUP.REQUEST_CONTROL_LABEL}>Assign Singer</label>
                          <select
                              value={item.assignedSingerId || ''}
                              onChange={(e) => onUpdate && onUpdate(idx, { assignedSingerId: e.target.value })}
                              className={EVENT_SETUP.REQUEST_SELECT}
                          >
                              <option value="">Auto</option>
                              {singers?.map(s => (
                                  <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                          </select>
                      </div>
                   </div>
                </div>
             ))}
          </div>
      )}
    </div>
  );
};
