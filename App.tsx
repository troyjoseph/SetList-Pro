import React from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import { AppSidebar } from './components/layout/AppSidebar';
import { MainContent } from './components/layout/MainContent';
import { PrintView } from './components/PrintView';
import { SingerModal, SongModal, MomentModal, ConfirmModal } from './components/Modals';
import { LAYOUT } from './styles/layout';

export default function App() {
  const logic = useAppLogic();
  
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

  return (
    <LAYOUT.CONTAINER>
      <AppSidebar 
        view={logic.view}
        setView={logic.setView}
        activeEventId={logic.activeEventId}
        currentEvent={logic.currentEvent}
      />

      <MainContent 
        {...logic}
        onAddSong={logic.handleAddSong}
      />

      {/* Modals */}
      <SingerModal 
        isOpen={logic.isSingerModalOpen} 
        onClose={() => logic.setIsSingerModalOpen(false)} 
        editingSinger={logic.editingSinger} 
        setEditingSinger={logic.setEditingSinger} 
        onSave={logic.handleSaveSinger} 
        songs={logic.songs} 
        setSongs={logic.setSongs} 
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