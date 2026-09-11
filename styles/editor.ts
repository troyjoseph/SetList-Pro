import { EDITOR_LAYOUT } from './editor/layout';
import { EDITOR_SIDEBAR } from './editor/sidebar';
import { EDITOR_TOOLBAR } from './editor/toolbar';
import { EDITOR_SET } from './editor/set';
import { EDITOR_ROW } from './editor/row';
import { EDITOR_MOMENTS } from './editor/moments';
import { EDITOR_TALLY } from './editor/tally';

export const EDITOR = {
  LAYOUT: EDITOR_LAYOUT.CONTAINER,
  SIDEBAR: EDITOR_SIDEBAR,
  CANVAS: {
    CONTAINER: EDITOR_LAYOUT.CANVAS_CONTAINER,
    TOOLBAR: EDITOR_TOOLBAR.CONTAINER,
    SCROLL_AREA: EDITOR_LAYOUT.SCROLL_AREA,
    CONTENT: EDITOR_LAYOUT.CONTENT
  },
  TOOLBAR: EDITOR_TOOLBAR,
  ROW: EDITOR_ROW,
  SET: EDITOR_SET,
  MOMENTS: EDITOR_MOMENTS,
  TALLY: EDITOR_TALLY,
  ADD_SET_BTN: EDITOR_SET.ADD_SET_BTN
};