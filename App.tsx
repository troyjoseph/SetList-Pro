
import React, { useState } from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import { useAuth } from './contexts/AuthContext';
import { AppSidebar } from './components/layout/AppSidebar';
import { MainContent } from './components/layout/MainContent';
import { PrintView } from './components/PrintView';
import { SingerModal, SongModal, MomentModal, ConfirmModal, BulkSingerImportModal } from './components/Modals';
import { LandingPage } from './components/LandingPage';
import { LAYOUT } from './styles/layout';
import { Loader2, Menu } from 'lucide-react';

export default function App() {
  const { user, loading } = useAuth();
  const logic = useAppLogic();
  const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);
  const [showLanding, setShowLanding] = useState(true);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={48} className="text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }
  
  // Print View is special as it takes over the whole screen
  if (logic.view === 'PRINT') {
      return (
        <PrintView 
            currentEvent={logic.currentEvent} 
            songs={logic.songs} 
            singers={logic.singers} 
            appDefaults={logic.appDefaults} 
            activeSingers={logic.activeSingers} 
            onBack={() => logic.setView('EDITOR')} 
        />
      );
  }

  const getMobileTitle = () => {
    switch (logic.view) {
      case 'DASHBOARD': return 'Dashboard';
      case 'SONGBANK': return 'Song Bank';
      case 'SINGERS': return 'Singers';
      case 'SETTINGS': return 'Settings';
      case 'EVENT_SETUP': return 'Event Setup';
      case 'EDITOR': return logic.currentEvent?.name || 'Editor';
      default: return 'Setlist♯';
    }
  };

  return (
    <LAYOUT.CONTAINER>
      <AppSidebar 
        view={logic.view}
        setView={logic.setView}
        activeEventId={logic.activeEventId}
        currentEvent={logic.currentEvent}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        {logic.view !== 'EDITOR' && (
          <LAYOUT.MOBILE_HEADER>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 hover:text-gray-900">
              <Menu size={24} />
            </button>
            <LAYOUT.MOBILE_TITLE>{getMobileTitle()}</LAYOUT.MOBILE_TITLE>
            <div className="w-6" /> {/* Spacer for centering */}
          </LAYOUT.MOBILE_HEADER>
        )}

        <MainContent 
          {...logic}
          onAddSong={logic.handleAddSong}
          onOpenAppSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Modals */}
      <SingerModal 
        isOpen={logic.isSingerModalOpen} 
        onClose={() => logic.setIsSingerModalOpen(false)} 
        editingSinger={logic.editingSinger} 
        setEditingSinger={logic.setEditingSinger} 
        onSave={logic.handleSaveSinger} 
        songs={logic.songs} 
        setSongs={logic.setSongs} 
        appDefaults={logic.appDefaults}
      />

      <BulkSingerImportModal
        isOpen={logic.isBulkSingerModalOpen}
        onClose={() => logic.setIsBulkSingerModalOpen(false)}
        songs={logic.songs}
        setSongs={logic.setSongs}
        appDefaults={logic.appDefaults}
        onImportComplete={(newSingers) => {
          logic.setSingers(prev => [...prev, ...newSingers]);
          logic.setIsBulkSingerModalOpen(false);
        }}
      />
      
      <SongModal 
        isOpen={logic.isSongModalOpen} 
        onClose={() => logic.setIsSongModalOpen(false)} 
        editingSong={logic.editingSong} 
        setEditingSong={logic.setEditingSong} 
        onSave={logic.handleSaveSong} 
        activeGigTypeTab={logic.activeGigTypeTab} 
        setActiveGigTypeTab={logic.setActiveGigTypeTab} 
        songs={logic.songs} 
        singers={logic.singers} 
      />
      
      <MomentModal 
        isOpen={logic.isMomentModalOpen} 
        onClose={() => logic.setIsMomentModalOpen(false)} 
        newMomentRequest={logic.newMomentRequest} 
        setNewMomentRequest={logic.setNewMomentRequest} 
        onAdd={logic.handleAddMoment} 
        songs={logic.songs} 
        activeSingers={logic.activeSingers} 
        appDefaults={logic.appDefaults} 
      />
      
      <ConfirmModal 
        isOpen={logic.confirmConfig.isOpen}
        title={logic.confirmConfig.title}
        message={logic.confirmConfig.message}
        onConfirm={logic.confirmConfig.onConfirm}
        onCancel={() => logic.setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </LAYOUT.CONTAINER>
  );
}
