import React from 'react';
import { Singer, Range } from '../../../types';
import { COMMON } from '../../../styles/common';
import { MODAL } from '../../../styles/modals';

interface BasicInfoPanelProps {
    editingSinger: Partial<Singer>;
    setEditingSinger: (s: Partial<Singer>) => void;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({ editingSinger, setEditingSinger }) => {
    return (
        <div className={MODAL.GRID_COL_2}>
            <div>
                <COMMON.LABEL>Name</COMMON.LABEL>
                <COMMON.INPUT.BASE type="text" value={editingSinger.name || ''} onChange={e => setEditingSinger({ ...editingSinger, name: e.target.value })} autoFocus />
            </div>
            <div>
                <COMMON.LABEL>Vocal Range</COMMON.LABEL>
                <COMMON.INPUT.SELECT value={editingSinger.range || Range.UNSPECIFIED} onChange={e => setEditingSinger({ ...editingSinger, range: e.target.value as Range })}>
                    {Object.values(Range).map(r => <option key={r} value={r}>{r}</option>)}
                </COMMON.INPUT.SELECT>
            </div>
        </div>
    );
};
