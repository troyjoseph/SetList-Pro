import React from 'react';
import { Song } from '../../../types';
import { COMMON } from '../../../styles/common';
import { MODAL } from '../../../styles/modals';

interface BasicInfoPanelProps {
    editingSong: Partial<Song>;
    setEditingSong: (s: Partial<Song>) => void;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({ editingSong, setEditingSong }) => {
    return (
        <div className={MODAL.GRID_3}>
            <div className={MODAL.COL_SPAN_2}>
                <COMMON.LABEL>Title</COMMON.LABEL>
                <COMMON.INPUT.BASE type="text" value={editingSong.title || ''} onChange={e => setEditingSong({ ...editingSong, title: e.target.value })} />
            </div>
            <div>
                <COMMON.LABEL>Original Key</COMMON.LABEL>
                <COMMON.INPUT.BASE type="text" value={editingSong.originalKey || ''} onChange={e => setEditingSong({ ...editingSong, originalKey: e.target.value })} />
            </div>
            <div className={MODAL.COL_SPAN_3}>
                <COMMON.LABEL>Artist</COMMON.LABEL>
                <COMMON.INPUT.BASE type="text" value={editingSong.artist || ''} onChange={e => setEditingSong({ ...editingSong, artist: e.target.value })} />
            </div>
        </div>
    );
};
