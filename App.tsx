
import React from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import { useAuth } from './contexts/AuthContext';
import { AppSidebar } from './components/layout/AppSidebar';
import { MainContent } from './components/layout/MainContent';
import { PrintView } from './components/PrintView';
import { SingerModal, SongModal, MomentModal, ConfirmModal } from './components/Modals';
import { Login } from './components/Login';
import { LAYOUT } from './styles/layout';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { user, loading } = useAuth();
  const logic = useAppLogic();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={48} className="text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
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
