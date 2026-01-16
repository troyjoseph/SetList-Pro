
import React from 'react';
import { LayoutDashboard, Music, Users, Settings as SettingsIcon, ListMusic, Calendar, LogOut } from 'lucide-react';
import { NavButton } from '../Shared';
import { LAYOUT } from '../../styles/layout';
import { EventDetails, ViewState } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface AppSidebarProps {
  view: ViewState;
  setView: (v: ViewState) => void;
  activeEventId: string | null;
  currentEvent: EventDetails | null;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ view, setView, activeEventId, currentEvent }) => {
  const { user, logout } = useAuth();

  return (
    <LAYOUT.SIDEBAR.CONTAINER>
        <LAYOUT.SIDEBAR.HEADER>
          <LAYOUT.SIDEBAR.LOGO_BG>
             <ListMusic className="text-white" size={24} />
          </LAYOUT.SIDEBAR.LOGO_BG>
          <LAYOUT.SIDEBAR.TITLE>SetList Pro</LAYOUT.SIDEBAR.TITLE>
        </LAYOUT.SIDEBAR.HEADER>
        <LAYOUT.SIDEBAR.NAV_CONTAINER>
          <NavButton active={view === 'DASHBOARD'} icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={() => setView('DASHBOARD')} />
          <NavButton active={view === 'SONGBANK'} icon={<Music size={20}/>} label="Song Bank" onClick={() => setView('SONGBANK')} />
          <NavButton active={view === 'SINGERS'} icon={<Users size={20}/>} label="Singers" onClick={() => setView('SINGERS')} />
          <LAYOUT.SIDEBAR.EVENT_SECTION>
             <LAYOUT.SIDEBAR.EVENT_LABEL>Current Event</LAYOUT.SIDEBAR.EVENT_LABEL>
             {activeEventId ? (
                <LAYOUT.SIDEBAR.EVENT_BUTTON $isActive={view === 'EDITOR' || view === 'EVENT_SETUP'} onClick={() => setView('EDITOR')}>
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
        
        <div className="px-4 py-2 border-t bg-gray-50/50">
           <div className="flex items-center space-x-2 mb-2">
             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
               {user?.name?.substring(0,2).toUpperCase()}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
               <p className="text-xs text-gray-500 truncate">{user?.email}</p>
             </div>
           </div>
        </div>

        <LAYOUT.SIDEBAR.FOOTER>
          <NavButton active={view === 'SETTINGS'} icon={<SettingsIcon size={18} />} label="Settings" onClick={() => setView('SETTINGS')} />
          <button 
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors mt-1 rounded-md"
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </LAYOUT.SIDEBAR.FOOTER>
      </LAYOUT.SIDEBAR.CONTAINER>
  );
};
