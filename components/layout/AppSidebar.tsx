
import React from 'react';
import { LayoutDashboard, Music, Users, Settings as SettingsIcon, ListMusic, Calendar, X } from 'lucide-react';
import { NavButton } from '../Shared';
import { LAYOUT } from '../../styles/layout';
import { EventDetails, ViewState } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface AppSidebarProps {
  view: ViewState;
  setView: (v: ViewState) => void;
  activeEventId: string | null;
  currentEvent: EventDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ view, setView, activeEventId, currentEvent, isOpen, onClose }) => {
  const { user } = useAuth();

  const handleNavClick = (v: ViewState) => {
    setView(v);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      <LAYOUT.SIDEBAR.OVERLAY $isOpen={isOpen} onClick={onClose} />
      <LAYOUT.SIDEBAR.CONTAINER $isOpen={isOpen}>
          <LAYOUT.SIDEBAR.HEADER>
            <div className="flex items-center space-x-3 flex-1">
              <LAYOUT.SIDEBAR.LOGO_BG>
                 <ListMusic className="text-white" size={24} />
              </LAYOUT.SIDEBAR.LOGO_BG>
              <LAYOUT.SIDEBAR.TITLE>Setlist♯</LAYOUT.SIDEBAR.TITLE>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </LAYOUT.SIDEBAR.HEADER>
          <LAYOUT.SIDEBAR.NAV_CONTAINER>
            <NavButton active={view === 'DASHBOARD'} icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={() => handleNavClick('DASHBOARD')} />
            <NavButton active={view === 'SONGBANK'} icon={<Music size={20}/>} label="Song Bank" onClick={() => handleNavClick('SONGBANK')} />
            <NavButton active={view === 'SINGERS'} icon={<Users size={20}/>} label="Singers" onClick={() => handleNavClick('SINGERS')} />
            <LAYOUT.SIDEBAR.EVENT_SECTION>
               <LAYOUT.SIDEBAR.EVENT_LABEL>Current Event</LAYOUT.SIDEBAR.EVENT_LABEL>
               {activeEventId ? (
                  <LAYOUT.SIDEBAR.EVENT_BUTTON $isActive={view === 'EDITOR' || view === 'EVENT_SETUP'} onClick={() => handleNavClick('EDITOR')}>
                      <LAYOUT.SIDEBAR.EVENT_NAME>{currentEvent?.name}</LAYOUT.SIDEBAR.EVENT_NAME>
                      <LAYOUT.SIDEBAR.EVENT_DATE_WRAPPER>
                          <LAYOUT.SIDEBAR.EVENT_ICON><Calendar size={10} /></LAYOUT.SIDEBAR.EVENT_ICON>
                          {currentEvent?.date}
                      </LAYOUT.SIDEBAR.EVENT_DATE_WRAPPER>
                  </LAYOUT.SIDEBAR.EVENT_BUTTON>
               ) : (
                  <div className="text-sm text-gray-400 italic px-2">No active event</div>
               )}
            </LAYOUT.SIDEBAR.EVENT_SECTION>
          </LAYOUT.SIDEBAR.NAV_CONTAINER>
          
          <LAYOUT.SIDEBAR.FOOTER>
            <NavButton active={view === 'SETTINGS'} icon={<SettingsIcon size={18} />} label="Settings" onClick={() => handleNavClick('SETTINGS')} />
          </LAYOUT.SIDEBAR.FOOTER>
        </LAYOUT.SIDEBAR.CONTAINER>
    </>
  );
};
