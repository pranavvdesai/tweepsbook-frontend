import type { TDToolType, TldrawApp } from '@tldraw/tldraw';

export type CanvasToolbarProps = {
  activeTool: TDToolType | null;
  tlDrawApp: TldrawApp | null;
};
