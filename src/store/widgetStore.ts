import { create } from "zustand";

export type WidgetType = "randomizer" | "timer" | "poll" | "image" | "text";

export interface RandomizerData {
  items: string[];
  allowRepeats: boolean;
  lastPicked?: string;
  pickedItems: string[];
}

export interface WidgetState {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  data?: RandomizerData | Record<string, any>;
}

interface WidgetStore {
  widgets: WidgetState[];
  selectedWidgetId: string | null;
  isSettingsPanelOpen: boolean;

  setSettingsPanelOpen: (isOpen: boolean) => void;
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  selectWidget: (id: string | null) => void;
  updateWidget: (
    id: string,
    updates: Partial<Omit<WidgetState, "id" | "type" | "zIndex">>
  ) => void;
  bringToFront: (id: string) => void;
}

export const useWidgetStore = create<WidgetStore>((set) => ({
  widgets: [],
  selectedWidgetId: null,
  isSettingsPanelOpen: false,

  setSettingsPanelOpen: (isOpen) => set({ isSettingsPanelOpen: isOpen }),

  addWidget: (type) =>
    set((state) => {
      const id = crypto.randomUUID();
      // Calculate center position or default position
      // For now, simple cascade or random position near center
      const startX = window.innerWidth / 2 - 150 + (Math.random() * 40 - 20);
      const startY = window.innerHeight / 2 - 100 + (Math.random() * 40 - 20);

      const maxZ =
        state.widgets.length > 0
          ? Math.max(...state.widgets.map((w) => w.zIndex))
          : 0;

      const newWidget: WidgetState = {
        id,
        type,
        x: startX,
        y: startY,
        width: 320,
        height: 200,
        zIndex: maxZ + 1,
        data:
          type === "randomizer"
            ? {
                items: [],
                allowRepeats: false,
                lastPicked: undefined,
                pickedItems: [],
              }
            : {},
      };

      return {
        widgets: [...state.widgets, newWidget],
        selectedWidgetId: id,
        isSettingsPanelOpen: state.isSettingsPanelOpen,
      };
    }),

  removeWidget: (id) =>
    set((state) => ({
      widgets: state.widgets.filter((w) => w.id !== id),
      selectedWidgetId:
        state.selectedWidgetId === id ? null : state.selectedWidgetId,
    })),

  selectWidget: (id) =>
    set((state) => {
      if (!id) return { selectedWidgetId: null, isSettingsPanelOpen: false };

      // Also bring to front on select
      const maxZ =
        state.widgets.length > 0
          ? Math.max(...state.widgets.map((w) => w.zIndex))
          : 0;
      const widget = state.widgets.find((w) => w.id === id);

      if (widget && widget.zIndex === maxZ) {
        return { selectedWidgetId: id }; // Already on top
      }

      return {
        selectedWidgetId: id,
        widgets: state.widgets.map((w) =>
          w.id === id ? { ...w, zIndex: maxZ + 1 } : w
        ),
      };
    }),

  updateWidget: (id, updates) =>
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    })),

  bringToFront: (id) =>
    set((state) => {
      const maxZ =
        state.widgets.length > 0
          ? Math.max(...state.widgets.map((w) => w.zIndex))
          : 0;
      return {
        widgets: state.widgets.map((w) =>
          w.id === id ? { ...w, zIndex: maxZ + 1 } : w
        ),
      };
    }),
}));
