import React from 'react';
import { Palette } from 'lucide-react';
import { COMMON } from '../../styles/common';
import { SETTINGS } from '../../styles/settings';

interface VisualPreferencesProps {
  highlightColor: string;
  setHighlightColor: (color: string) => void;
}

export const VisualPreferences: React.FC<VisualPreferencesProps> = ({ highlightColor, setHighlightColor }) => (
  <div className={SETTINGS.SECTION}>
    <h3 className={SETTINGS.SECTION_HEADER}>
        <Palette size={20} className="mr-2"/> Visual Preferences
    </h3>
    <div>
        <COMMON.LABEL className="mb-2">Key Change Highlight Color</COMMON.LABEL>
        <div className={SETTINGS.VISUAL_GRID}>
            {['yellow', 'orange', 'red', 'green', 'blue', 'purple', 'pink'].map(color => (
                <button
                    key={color}
                    onClick={() => setHighlightColor(color)}
                    className={SETTINGS.COLOR_BTN(color, highlightColor === color)}
                >
                    <div className={SETTINGS.COLOR_DOT(color, highlightColor === color)} />
                </button>
            ))}
        </div>
        <p className={SETTINGS.VISUAL_DESC}>Used to highlight songs where the singer's key differs from the original.</p>
    </div>
  </div>
);