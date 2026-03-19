import React from 'react';
import { Song, GigType, SetPreference } from '../../../types';
import { StarRating } from '../../Shared';
import { MODAL } from '../../../styles/modals';

interface GigDataPanelProps {
    activeGigTypeTab: GigType;
    editingSong: Partial<Song>;
    setEditingSong: (s: Partial<Song>) => void;
}

export const GigDataPanel: React.FC<GigDataPanelProps> = ({ activeGigTypeTab, editingSong, setEditingSong }) => {
    if (!editingSong.gigData || !editingSong.gigData[activeGigTypeTab]) return null;

    return (
        <>
            <div className={MODAL.FLEX_BETWEEN}>
                <label className={MODAL.FONT_MEDIUM}>Rating for {activeGigTypeTab}</label>
                <StarRating rating={editingSong.gigData[activeGigTypeTab].rating} onChange={(r) => { const gd = { ...editingSong.gigData }; gd![activeGigTypeTab].rating = r; setEditingSong({ ...editingSong, gigData: gd }); }} />
            </div>
            <div className={MODAL.CHECKBOX_WRAPPER}>
                <label className={MODAL.CHECKBOX_LABEL}>
                    <input type="checkbox" checked={editingSong.gigData[activeGigTypeTab].isSlow} onChange={e => { const gd = { ...editingSong.gigData }; gd![activeGigTypeTab].isSlow = e.target.checked; setEditingSong({ ...editingSong, gigData: gd }); }} className={MODAL.CHECKBOX_INPUT} />
                    <span className={MODAL.CHECKBOX_TEXT}>Slow Song</span>
                </label>
                <label className={MODAL.CHECKBOX_LABEL}>
                    <input type="checkbox" checked={editingSong.gigData[activeGigTypeTab].isDuet} onChange={e => { const gd = { ...editingSong.gigData }; gd![activeGigTypeTab].isDuet = e.target.checked; setEditingSong({ ...editingSong, gigData: gd }); }} className={MODAL.CHECKBOX_INPUT} />
                    <span className={MODAL.CHECKBOX_TEXT}>Duet</span>
                </label>
            </div>
            <div className={MODAL.GRID_COL_2}>
                <div>
                    <label className={MODAL.SELECT_LABEL}>Preferred Set</label>
                    <select value={editingSong.gigData[activeGigTypeTab].preferredSets} onChange={e => { const gd = { ...editingSong.gigData }; gd![activeGigTypeTab].preferredSets = e.target.value as SetPreference; setEditingSong({ ...editingSong, gigData: gd }); }} className={MODAL.SELECT_INPUT}>
                        {['ANY', 'FIRST', 'FIRST_TWO', 'LAST', 'LAST_TWO'].map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                    </select>
                </div>
                <div>
                    <label className={MODAL.SELECT_LABEL}>Avoid Set</label>
                    <select value={editingSong.gigData[activeGigTypeTab].setsToAvoid} onChange={e => { const gd = { ...editingSong.gigData }; gd![activeGigTypeTab].setsToAvoid = e.target.value as SetPreference; setEditingSong({ ...editingSong, gigData: gd }); }} className={MODAL.SELECT_INPUT}>
                        {['ANY', 'FIRST', 'FIRST_TWO', 'LAST', 'LAST_TWO'].map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                    </select>
                </div>
            </div>
        </>
    );
};
